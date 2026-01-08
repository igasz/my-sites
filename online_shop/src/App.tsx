import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProductDetails from './pages/ProductDetails';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import OrdersHistory from './pages/OrdersHistory';
import OrderDetails from './pages/OrderDetails';
import Register from './pages/Register';

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 40px', 
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg)'
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
        STORE
      </Link>
      <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
        <Link to="/">Sklep</Link>
        <Link to="/cart">Koszyk</Link>
        <Link to="/login">Konto</Link>

        {user ? (
          <>
            <Link to="/orders">Zamówienia</Link>
            <span style={{color: 'var(--color-accent)'}}>Witaj</span>
            <button onClick={logout} 
              style={{ padding: '5px 10px', fontSize: '0.7rem', marginLeft: '10px' }}>
              Wyloguj
            </button>
          </>
        ) : (
          <Link to="/login">Zaloguj</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<OrdersHistory />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;