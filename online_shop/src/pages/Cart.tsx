import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
    const { cartProducts, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate])

    const shippingCost = totalPrice > 200 ? 0 : 15;
    const finalTotal = totalPrice + shippingCost;


    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Musisz być zalogowany, aby złożyć zamówienie!");
            navigate('/login');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    total: finalTotal,
                    items: cartProducts
                })
            });

            if (response.ok) {
                alert("Dziękujemy! Zamówienie zostało przyjęte.");
                clearCart();
                navigate('/orders');
            } else {
                alert("Wystąpił błąd podczas składania zamówienia.");
            }
        } catch (error) {
            console.error(error);
            alert("Błąd połączenia z serwerem.");
        }
    }

    if (cartProducts.length === 0) {
        return (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '20px' }}>
            Twój koszyk jest pusty
            </h2>
            <Link to="/">
            <button>WRÓĆ DO SKLEPU</button>
            </Link>
        </div>
        );
    }

    return (
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            
            <h1 style={{ textAlign: 'center', marginBottom: '60px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>Twój koszyk</h1>
            
            {/* produkty */} 
            <div style={{  display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start' }}>
                    <div style={{ flex: '2', minWidth: '300px' }}>
                    {cartProducts.map(item => (
                        <div key={item.id} style={{display: 'flex', gap: '20px', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid var(--color-border)', alignItems: 'center'}}> 
                            
                            <div style={{ width: '100px', height: '100px', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={item.image} alt={item.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}}/>
                            </div>
                            
                            <div style={{ flexGrow: 1 }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sec)', textTransform: 'uppercase', marginBottom: '5px' }}>{item.category}</p>
                                
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}> 
                                    <Link to={`/product/${item.id}`}>{item.title}</Link>
                                </h3>
                                
                                <button onClick={() => removeFromCart(item.id)}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        padding: 0, 
                                        color: '#59392d', 
                                        fontSize: '0.8rem', 
                                        textDecoration: 'underline', 
                                        cursor: 'pointer' 
                                    }}>
                                    Usuń
                                </button>
                            </div>
                            
                            {/* ilość przycisk */}
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', height: '40px' }}>
                                
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                style={{ background: 'transparent', color: 'var(--color-text-main)', padding: '0 10px' }}
                                >-</button>
                                
                                <span style={{ padding: '0 10px', fontWeight: 'bold' }}>{item.quantity}</span>
                                
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                style={{ background: 'transparent', color: 'var(--color-text-main)', padding: '0 10px' }}
                                >+</button>
                            </div>
                            
                            <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* podsumowanie */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ padding: '40px', border: '1px solid var(--color-border)', position: 'sticky', top: '20px'}}>
                        
                        <h3 style={{ marginTop: 0, fontSize: '1.5rem', marginBottom: '30px' }}>Podsumowanie</h3>

                        <div style={{ marginBottom: '15px', color: 'var(--color-text-sec)' }}>
                            <span>Wartość produktów: </span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>

                        <div style={{marginBottom: '30px', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-text-main)', borderTop: '1px solid var(--color-border)', paddingTop: '20px'}}>
                            <span>Suma: </span> 
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>

                        <button style={{ width: '100%' }} onClick={handleCheckout}>
                            PRZEJDŹ DO KASY
                        </button>

                        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                            Darmowa dostawa od $200
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;