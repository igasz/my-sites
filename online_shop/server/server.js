const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const SECRET_KEY = "tajne_haslo";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

//użytkownik
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
});

//zamówienie
const Order = sequelize.define('Order', {
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'zrealizowane'
    },
    items: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('items');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('items', JSON.stringify(value));
        }
    }
});

//opinie
const Review = sequelize.define('Review', {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false } // ID produktu z FakeStoreAPI
});


User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Review);
Review.belongsTo(User);

const MOCK_USERS = [
    { email: 'student@projekt.pl', password: '123', role: 'user' },
    { email: 'admin@projekt.pl',   password: '123', role: 'admin' }
];

sequelize.sync({ force: false }).then(async () => {
    console.log("Baza danych zsynchronizowana.");

    for (const mockUser of MOCK_USERS) {
        const exists = await User.findOne({ where: { email: mockUser.email } });
        
        if (!exists) {
            const hashedPassword = await bcrypt.hash(mockUser.password, 10);
            await User.create({
                email: mockUser.email,
                password: hashedPassword,
                role: mockUser.role
            });
            console.log(`--> Dodano domyślne konto: ${mockUser.email}`);
        }
    }
});


app.use(cors());
app.use(express.json());

//czy zalogowany
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return req.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


//tworzenie konta, rejestracja
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "Użytkownik utworzony" });
    } catch (error) {
        res.status(400).json({ error: "Email jest zajęty lub nieprawidłowy" });
    }
});

//logowanie
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: "Błędne dane logowania" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

//historia zamówień
app.get('/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { UserId: req.user.userId },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Nie udało się pobrać zamówień" });
    }
});

//składanie zamówień
app.post('/orders', authenticate, async (req, res) => {
    const { total, items } = req.body;
    try {
        const newOrder = await Order.create({
            total,
            items,
            UserId: req.user.userId
        });
        res.json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Błąd zapisu" });
    }
});

//opinie
app.get('/reviews/:productId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: req.params.productId },
            include: [{ model: User, attributes: ['email'] }] // Dołączamy email autora
        });
        res.json(reviews);
    } catch (e) { res.status(500).json({ error: "Błąd serwera" }); }
});

// dodaj opinie
app.post('/reviews', authenticate, async (req, res) => {
    try {
        const existing = await Review.findOne({
            where: { UserId: req.user.userId, productId: req.body.productId }
        });
        if (existing) {
            return res.status(400).json({ error: "Możesz dodać tylko jedną opinię do produktu!" });
        }

        const review = await Review.create({
            rating: req.body.rating,
            text: req.body.text,
            productId: req.body.productId,
            UserId: req.user.userId
        });
        const fullReview = await Review.findByPk(review.id, {
            include: [{ model: User, attributes: ['email'] }]
        });
        res.json(fullReview);
    } catch (e) { res.status(500).json({ error: "Błąd dodawania opinii" }); }
});

// usuń opinie
app.delete('/reviews/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: "Nie znaleziono" });

        if (req.user.role !== 'admin' && review.UserId !== req.user.userId) {
            return res.status(403).json({ error: "Brak uprawnień" });
        }

        await review.destroy();
        res.json({ message: "Usunięto" });
    } catch (e) { res.status(500).json({ error: "Błąd usuwania" }); }
});


app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});