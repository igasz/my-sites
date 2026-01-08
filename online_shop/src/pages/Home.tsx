import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate: number;
        count: number;
    };
}

function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { addToCart } = useCart();

    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">("default");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then((data: Product[]) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const filteredProducts = products
        .filter(product => {
            const matchesCategory = selectedCategory === "all" || 
                (selectedCategory === "jewelery" && product.category === "jewelery") ||
                (selectedCategory === "men" && product.category === "men's clothing") ||
                (selectedCategory === "women" && product.category === "women's clothing") ||
                (selectedCategory === "electronics" && product.category === "electronics");

            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortOrder === "asc") return a.price - b.price;
            if (sortOrder === "desc") return b.price - a.price;
            return 0;
        });

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Ładowanie kolekcji...</div>;
  }

  const filterBtnStyle = (category: string) => ({
        padding: '10px 20px',
        border: '1px solid var(--color-border)',
        backgroundColor: selectedCategory === category ? 'var(--color-text-main)' : 'transparent',
        color: selectedCategory === category ? '#fff' : 'var(--color-text-main)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase' as const
    });

  return (
    <div>
        <header style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h1 style={{ display: 'inline-block', position: 'relative', borderBottom: '1px solid var(--color-border)', paddingBottom: '18px' }}>Nowa Kolekcja</h1>
        </header>

        <div style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            
            <div style={{ width: '100%', maxWidth: '500px', marginBottom: '10px' }}>
                <input 
                    type="text"
                    placeholder="Wyszukaj produkt po nazwie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 20px',
                        border: '1px solid var(--color-border)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setSelectedCategory("all")} style={filterBtnStyle("all")}>Wszystkie</button>
                <button onClick={() => setSelectedCategory("jewelery")} style={filterBtnStyle("jewelery")}>Biżuteria</button>
                <button onClick={() => setSelectedCategory("women")} style={filterBtnStyle("women")}>Ona</button>
                <button onClick={() => setSelectedCategory("men")} style={filterBtnStyle("men")}>On</button>
                <button onClick={() => setSelectedCategory("electronics")} style={filterBtnStyle("electronics")}>Elektronika</button>

              <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  style={{ 
                      padding: '10px', 
                      border: 'none', 
                      borderBottom: '1px solid var(--color-text-main)', 
                      backgroundColor: 'transparent', 
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-sec)',
                      outline: 'none',
                      cursor: 'pointer'
                  }}>
                  <option value="default">Domyślna kolejność</option>
                  <option value="asc">Cena: rosnąco</option>
                  <option value="desc">Cena: malejąco</option>
              </select>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '80px' }}>
           {filteredProducts.map(product => (
            <div key={product.id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' }}>
            
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                    height: '350px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '20px', 
                    // backgroundColor: '#fbf9f7ff',
                    transition: 'transform 0.3s ease'}}>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
                />
              </div>
            </Link> 
            <div>
              <Link to={`/product/${product.id}`}>
                <h3 style={{margin: '0 0 5px 0', fontWeight: '400', cursor: 'pointer'}}>
                  {product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title}
                </h3>
              </Link>
              <p>{product.category}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontWeight: '700' }}>${product.price}</span>
                <button
                    onClick={() => { 
                          addToCart(product, 1); 
                          alert("Dodano do koszyka!"); 
                      }} 
                    style={{ padding: '8px 15px', fontSize: '0.7rem' }}>do koszyka</button>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  )
}

export default Home;