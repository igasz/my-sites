import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Hasła muszą być takie same!");
            return;
        }

        try {
            // Łączymy się z Twoim serwerem backendowym
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("Konto utworzone! Możesz się zalogować.");
                navigate('/login'); // Przekierowanie do logowania
            } else {
                const data = await response.json();
                setError(data.error || "Błąd rejestracji");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem");
        }
    };

    // Style dla inputów (takie same jak w CSS)
    const inputStyle = {
        padding: '15px',
        border: '1px solid var(--color-text-sec)',
        fontSize: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        color: 'var(--color-text-main)',
        fontFamily: 'var(--font-body)',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box' as const
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '40px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '30px' }}>Załóż konto</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input 
                    type="email" 
                    placeholder="Adres e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                
                <input 
                    type="password" 
                    placeholder="Hasło" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />

                <input 
                    type="password" 
                    placeholder="Potwierdź hasło" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={inputStyle}
                />

                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

                <button type="submit" style={{ width: '100%', padding: '15px', fontWeight: 'bold' }}>
                    ZAŁÓŻ KONTO
                </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                Masz już konto? <Link to="/login" style={{ textDecoration: 'underline' }}>Zaloguj się</Link>
            </p>
        </div>
    );
}

export default Register;
