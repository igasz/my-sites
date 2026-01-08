import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Order, MOCK_ORDERS } from '../data/orders';

function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3000/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const found = data.find((o: any) => o.id === Number(id));
                    
                    if (found) {
                        found.date = new Date(found.createdAt).toLocaleDateString('pl-PL');
                        setOrder(found);
                    }
                }
            } catch (err) { console.error(err); }
        };
        fetchOrder();
    }, [id]);

    if (!order) {
        return (
            <div>Nie znaleziono zamówienia.</div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <Link to="/orders" style={{ 
                textDecoration: 'none', 
                color: 'var(--color-text-sec)', 
                fontSize: '0.9rem', 
                textTransform: 'uppercase', 
                letterSpacing: '1px' }}>&larr; Wróć do listy</Link>

            <div style={{ marginTop: '30px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <h1 style={{ margin: '0 0 10px 0' }}>Szczegóły zamówienia {order.id}</h1>
                <p>Data: {order.date}</p>
                <p>Status: {order.status}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                        <th style={{ padding: '15px 10px', textAlign: 'left', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', fontSize: '1.1rem' }}>Produkt</th>
                        <th style={{ padding: '15px 10px', textAlign: 'center', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', fontSize: '1.1rem' }}>Cena</th>
                        <th style={{ padding: '15px 10px', textAlign: 'center', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', fontSize: '1.1rem' }}>Ilość</th>
                        <th style={{ padding: '15px 10px', textAlign: 'right', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', fontSize: '1.1rem'}}>Razem</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '15px 10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                            {item.title}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center', color: 'var(--color-text-sec)' }}>${item.price}</td>
                            <td style={{ padding: '10px', textAlign: 'center', color: 'var(--color-text-sec)' }}>{item.quantity}</td>
                            <td style={{ padding: '10px', textAlign: 'center', color: 'var(--color-text-sec)' }}>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                </table>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-sec)' }}>Suma całkowita:</p>
                    <p style={{ 
                        margin: '5px 0 0 0', 
                        fontSize: '1.25rem', 
                        color: 'var(--color-accent)', 
                        fontWeight: 'bold' 
                    }}>
                        ${order.total.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;