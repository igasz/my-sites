import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type Order, MOCK_ORDERS } from '../data/orders';

function OrdersHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3000/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const formattedData = data.map((order: any) => ({
                        ...order,
                        date: new Date(order.createdAt).toLocaleDateString('pl-PL'), 
                        status: order.status 
                    }));
                    setOrders(formattedData);
                }
            } catch (err) {
                console.error("Błąd pobierania historii", err);
            }
        }
        fetchOrders();
    }, [user]);

    if (!user) {
        return <div style={{padding: '20px'}}>Zaloguj się</div>
    }

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1 style={{ display: 'inline-block', position: 'relative', borderBottom: '1px solid var(--color-border)', paddingBottom: '18px' }}>Twoje zamówienia</h1>
            </header>

            {orders.length === 0 ? (
                <p>Nie masz jeszcze żadnych zamówień.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--color-border)'
                        }}>
                            <div>
                                <h3>Zamówienie {order.id}</h3>
                                <p>Data: {order.date}</p>
                                <p>Suma: ${order.total.toFixed(2)}</p>
                                <span style={{display: 'inline-block', fontSize: '0.8rem', color: 'var(--color-accent)'}}>{order.status.toUpperCase()}</span>
                            </div>
                            <Link to={`/orders/${order.id}`} style={{
                                textDecoration: 'none',
                                backgroundColor: 'transparent',
                                color: 'var(--color-text-sec)',
                                border: '1px solid var(--color-text-sec)',
                                padding: '10px 20px',
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                letterSpacing: '1.6px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-text-sec)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--color-text-sec)';
                            }}>
                                SZCZEGÓŁY &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdersHistory;