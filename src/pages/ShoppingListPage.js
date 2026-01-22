import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gerarRoteiro, getProdutos } from '../services/api';
const IMG_PADRAO = '/default.jpg';

function ShoppingListPage() {
  const [lista, setLista] = useState(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });
  const [produtosDetalhes, setProdutosDetalhes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (lista.length > 0) {
      getProdutos().then(res => {
        setProdutosDetalhes(res.data.filter(p => lista.some(item => item.produto === p._id)));
      });
    } else {
      setProdutosDetalhes([]);
    }
  }, [lista]);

  const remover = (produtoId) => {
    const novaLista = lista.filter(item => item.produto !== produtoId);
    setLista(novaLista);
    localStorage.setItem('shoppingList', JSON.stringify(novaLista));
  };

  const voltar = () => navigate('/catalog');

  const gerar = async () => {
    setLoading(true);
    setErro('');
    try {
      const res = await gerarRoteiro(lista);
      navigate('/roteiro', { state: { roteiro: res.data.roteiro } });
    } catch (e) {
      setErro('Erro ao gerar roteiro. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <h2>Lista de Compras</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={voltar} style={{ background: '#eee', border: '1px solid #ccc', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>
          Voltar ao Catálogo
        </button>
        {produtosDetalhes.length > 0 && (
          <button onClick={() => { setLista([]); localStorage.setItem('shoppingList', '[]'); }} style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 600 }}>
            Nova Lista
          </button>
        )}
      </div>
      {produtosDetalhes.length === 0 && <div style={{ color: '#888', marginTop: 32 }}>Sua lista está vazia.</div>}
      {produtosDetalhes.length > 0 && (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {produtosDetalhes.map(produto => (
              <li key={produto._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 0' }}>
                <img src={produto.foto || IMG_PADRAO} alt={produto.nome} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{produto.nome}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{produto.categoria?.nome}</div>
                  <div style={{ color: '#1e7d34', fontWeight: 600 }}>R$ {produto.preco?.toFixed(2)}</div>
                </div>
                <button onClick={() => remover(produto._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <button onClick={gerar} disabled={loading} style={{ marginTop: 24, background: '#1e7d34', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Gerando roteiro...' : 'Gerar Roteiro'}
          </button>
        </>
      )}
      {erro && <div style={{ color: 'red', marginTop: 16 }}>{erro}</div>}
    </div>
  );
}

export default ShoppingListPage;
