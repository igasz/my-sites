import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(email, password);

        if (success) {
            navigate('/');
        } else {
            setError('Nieprawidłowy login lub hasło');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', border: '1px solid var(--color-border)', textAlign: 'center'}}>
            <h1 style={{ marginBottom: '30px' }}>Zaloguj się</h1> 

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <input 
                    type="email"
                    placeholder="Adres E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                
                <input 
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>

                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

                <button type="submit" disabled={loading} style={{ padding: '15px', fontWeight: 'bold' }}>
                    {loading ? "LOGOWANIE..." : "ZALOGUJ"}
                </button>
            </form>
            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                <Link to="/register" style={{ textDecoration: 'underline' }}>Stwórz nowe konto</Link>
            </p>
        </div>
    )
}

export default Login;