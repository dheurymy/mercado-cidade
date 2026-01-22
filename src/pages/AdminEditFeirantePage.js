import React, { useEffect, useState } from 'react';
import api from '../services/api';
import FeiranteBoxForm from '../components/FeiranteBoxForm';
import ProdutoForm from '../components/ProdutoForm';
import { useParams, useNavigate } from 'react-router-dom';

function AdminEditFeirantePage() {
  const { feiranteId } = useParams();
  const [feirante, setFeirante] = useState(null);
  const [box, setBox] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [editandoBox, setEditandoBox] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/auth/feirantes').then(res => {
      setFeirante(res.data.find(f => f._id === feiranteId));
    });
    api.get('/api/boxes?feirante=' + feiranteId).then(res => {
      setBox(res.data[0]);
      if (res.data[0]) {
        api.get('/api/products?box=' + res.data[0]._id).then(r => setProdutos(r.data));
      }
    });
  }, [feiranteId, editandoBox, editandoProduto]);

  const salvarBox = async (dados) => {
    await api.put('/api/boxes/' + box._id, { ...dados, feirante: feiranteId });
    setEditandoBox(false);
  };

  const salvarProduto = async (dados) => {
    if (editandoProduto) {
      await api.put('/api/products/' + editandoProduto._id, { ...dados, box: box._id });
    } else {
      await api.post('/api/products', { ...dados, box: box._id });
    }
    setEditandoProduto(null);
  };

  const removerProduto = async (id) => {
    await api.delete('/api/products/' + id);
    setEditandoProduto(null);
  };

  if (!feirante) return <div style={{ margin: 40 }}>Feirante não encontrado.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h2 style={{ color: '#e67e22', fontWeight: 900, marginBottom: 24 }}>Editar Box e Produtos de {feirante.nome}</h2>
      <div style={{ background: '#f8f8f8', borderRadius: 10, padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Box</h3>
        {box && !editandoBox && (
          <div style={{ marginBottom: 12 }}>
            <div><b>Nome:</b> {box.nome}</div>
            <div><b>Descrição:</b> {box.descricao}</div>
            <div><b>Localização:</b> {box.localizacao}</div>
            <div><b>Tipo:</b> {box.tipoEstabelecimento?.nome}</div>
            <button onClick={() => setEditandoBox(true)} style={{ marginTop: 10, background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Editar Box</button>
          </div>
        )}
        {box && editandoBox && (
          <FeiranteBoxForm box={box} onSave={salvarBox} />
        )}
      </div>
      {box && (
        <div style={{ background: '#f8f8f8', borderRadius: 10, padding: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Produtos do Box</h3>
          <button onClick={() => setEditandoProduto({})} style={{ marginBottom: 18, background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Novo Produto</button>
          {editandoProduto && (
            <ProdutoForm produto={editandoProduto._id ? editandoProduto : null} onSave={salvarProduto} />
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {produtos.map(prod => (
              <li key={prod._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 0' }}>
                <img src={prod.foto || '/default.jpg'} alt={prod.nome} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{prod.nome}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{prod.categoria?.nome}</div>
                  <div style={{ color: '#e67e22', fontWeight: 600 }}>R$ {prod.preco?.toFixed(2)}</div>
                </div>
                <button onClick={() => setEditandoProduto(prod)} style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', marginRight: 8, cursor: 'pointer' }}>Editar</button>
                <button onClick={() => removerProduto(prod._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate('/admin/dashboard')} style={{ marginTop: 32, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 18, cursor: 'pointer', width: '100%' }}>Voltar ao Dashboard</button>
    </div>
  );
}

export default AdminEditFeirantePage;
