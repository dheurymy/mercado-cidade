
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProdutos, getCategorias } from '../services/api';
const IMG_PADRAO = '/default.jpg';




function CatalogPage() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [busca, setBusca] = useState('');
  const [lista, setLista] = useState(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });
  const [feedback, setFeedback] = useState({}); // { [produtoId]: 'mensagem' }
  const navigate = useNavigate();

  useEffect(() => {
    getProdutos().then(res => setProdutos(res.data)).catch(() => setProdutos([]));
    getCategorias().then(res => setCategorias(res.data)).catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(lista));
  }, [lista]);

  const produtosFiltrados = produtos.filter(p => {
    const matchCategoria = filtro ? p.categoria && p.categoria._id === filtro : true;
    const matchBusca = busca ? (p.nome.toLowerCase().includes(busca.toLowerCase()) || (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()))) : true;
    return matchCategoria && matchBusca;
  });

  const adicionarNaLista = (produto) => {
    if (!lista.find(item => item.produto === produto._id)) {
      setLista([...lista, { produto: produto._id, quantidade: 1, nome: produto.nome }]);
      setFeedback(fb => ({ ...fb, [produto._id]: 'Adicionado à lista!' }));
    } else {
      setFeedback(fb => ({ ...fb, [produto._id]: 'Já está na lista.' }));
    }
    setTimeout(() => {
      setFeedback(fb => ({ ...fb, [produto._id]: '' }));
    }, 1800);
  };

  const irParaLista = () => {
    navigate('/shopping-list');
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ color: '#1e7d34', fontWeight: 900, fontSize: 32 }}>+ Mercado</h1>
        <div>
          <button onClick={irParaLista} style={{ marginRight: 16, background: '#eee', border: '1px solid #ccc', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>
            Lista de Compras ({lista.length})
          </button>
          <Link to="/feirante-area">
            <button style={{ padding: '8px 18px', fontWeight: 600, background: '#1e7d34', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Área do Feirante / Admin
            </button>
          </Link>
        </div>
      </header>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <select value={filtro} onChange={e => setFiltro(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="">Todas as categorias</option>
          {categorias.filter(c => c.tipo === 'produto').map(c => (
            <option key={c._id} value={c._id}>{c.nome}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {produtosFiltrados.map(produto => (
          <div key={produto._id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={produto.foto || IMG_PADRAO} alt={produto.nome} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            <h3 style={{ margin: '8px 0 4px 0' }}>{produto.nome}</h3>
            <div style={{ color: '#888', fontSize: 14 }}>{produto.categoria?.nome}</div>
            <div style={{ fontWeight: 600, color: '#1e7d34', margin: '8px 0' }}>R$ {produto.preco?.toFixed(2)}</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>{produto.descricao}</div>
            <button onClick={() => adicionarNaLista(produto)} style={{ background: '#1e7d34', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', marginTop: 8 }}>
              Adicionar à Lista
            </button>
            {feedback[produto._id] && (
              <div style={{ marginTop: 8, color: feedback[produto._id] === 'Adicionado à lista!' ? '#1e7d34' : '#e67e22', fontWeight: 500, fontSize: 14 }}>
                {feedback[produto._id]}
              </div>
            )}
          </div>
        ))}
      </div>
      {produtosFiltrados.length === 0 && <div style={{ marginTop: 32, color: '#888' }}>Nenhum produto encontrado.</div>}
    </div>
  );
}

export default CatalogPage;
