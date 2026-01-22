import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FeiranteBoxForm from '../components/FeiranteBoxForm';
import ProdutoForm from '../components/ProdutoForm';

function FeirantePanelPage() {
  const navigate = useNavigate();
  const [box, setBox] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [editandoBox, setEditandoBox] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    api.get('/api/boxes?feirante=' + user._id).then(res => {
      setBox(res.data[0]);
      if (res.data[0]) {
        api.get('/api/products?box=' + res.data[0]._id).then(r => setProdutos(r.data));
      }
    });
  }, [editandoBox, editandoProduto]);

  const salvarBox = async (dados) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      if (box) {
        await api.put('/api/boxes/' + box._id, { ...dados, feirante: user._id });
        setMensagem('Box atualizado com sucesso!');
      } else {
        await api.post('/api/boxes', { ...dados, feirante: user._id });
        setMensagem('Box criado com sucesso!');
      }
      setEditandoBox(false);
    } catch (err) {
      setErro('Erro ao salvar box.');
    }
  };

  const salvarProduto = async (dados) => {
    setErro('');
    setMensagem('');
    try {
      if (editandoProduto && editandoProduto._id) {
        await api.put('/api/products/' + editandoProduto._id, { ...dados, box: box._id });
        setMensagem('Produto atualizado com sucesso!');
      } else {
        await api.post('/api/products', { ...dados, box: box._id });
        setMensagem('Produto criado com sucesso!');
      }
    } catch (err) {
      setErro('Erro ao salvar produto.');
    }
  };

  const removerProduto = async (id) => {
    setErro('');
    setMensagem('');
    try {
      await api.delete('/api/products/' + id);
      setMensagem('Produto removido com sucesso!');
      setEditandoProduto(null);
    } catch (err) {
      setErro('Erro ao remover produto.');
    }
  };

  if (!localStorage.getItem('user')) {
    return <div style={{ margin: 40, color: 'red' }}>Faça login para acessar o painel do feirante.</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/feirante-area');
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#1e7d34', fontWeight: 900 }}>Painel do Feirante</h2>
        <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Sair</button>
      </div>
      <div style={{ background: '#f8f8f8', borderRadius: 10, padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Meu Box</h3>
        {box && !editandoBox && (
          <div style={{ marginBottom: 12 }}>
            <div><b>Nome:</b> {box.nome}</div>
            <div><b>Descrição:</b> {box.descricao}</div>
            <div><b>Localização:</b> {box.localizacao}</div>
            <div><b>Tipo:</b> {box.tipoEstabelecimento?.nome}</div>
            <button onClick={() => setEditandoBox(true)} style={{ marginTop: 10, background: '#2186eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Editar Box</button>
          </div>
        )}
        {(!box || editandoBox) && (
          <>
            <FeiranteBoxForm box={box} onSave={salvarBox} />
            <button onClick={() => setEditandoBox(false)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 4 }}>Cancelar</button>
          </>
        )}
      </div>
      {box && (
        <div style={{ background: '#f8f8f8', borderRadius: 10, padding: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Produtos do Box</h3>
          <button onClick={() => setEditandoProduto({})} style={{ marginBottom: 18, background: '#1e7d34', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Novo Produto</button>
          {editandoProduto && (
            <div style={{ marginBottom: 18 }}>
              <ProdutoForm produto={editandoProduto._id ? editandoProduto : null} onSave={async (dados) => {
                await salvarProduto(dados);
                setEditandoProduto(null);
                // Atualiza lista após salvar
                const r = await api.get('/api/products?box=' + box._id);
                setProdutos(r.data);
              }} />
              <button onClick={() => setEditandoProduto(null)} style={{ marginTop: 4, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {produtos.map(prod => (
              <li key={prod._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 0' }}>
                <img src={prod.foto || '/default.jpg'} alt={prod.nome} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{prod.nome}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{prod.categoria?.nome}</div>
                  <div style={{ color: '#1e7d34', fontWeight: 600 }}>R$ {prod.preco?.toFixed(2)}</div>
                </div>
                <button onClick={() => setEditandoProduto(prod)} style={{ background: '#2186eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', marginRight: 8, cursor: 'pointer' }}>Editar</button>
                <button onClick={async () => {
                  await removerProduto(prod._id);
                  // Atualiza lista após remover
                  const r = await api.get('/api/products?box=' + box._id);
                  setProdutos(r.data);
                }} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mensagem && <div style={{ color: '#1e7d34', marginTop: 16, fontWeight: 600 }}>{mensagem}</div>}
      {erro && <div style={{ color: 'red', marginTop: 16 }}>{erro}</div>}
    </div>
  );
}

export default FeirantePanelPage;
