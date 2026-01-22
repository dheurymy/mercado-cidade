import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminAnalytics from '../components/AdminAnalytics';

function AdminDashboardPage() {
  const [feirantes, setFeirantes] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [buscaAtiva, setBuscaAtiva] = useState('');

  useEffect(() => {
    api.get('/api/boxes').then(res => setBoxes(res.data));
    api.get('/api/products').then(res => setProdutos(res.data));
    api.get('/api/auth/feirantes').then(res => setFeirantes(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#e67e22', fontWeight: 900 }}>Dashboard do Administrador</h2>
        <button
          onClick={() => {
            localStorage.removeItem('currentUser');
            window.location.href = '/login';
          }}
          style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
        >
          <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i> Sair
        </button>
      </div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#fffbe6', borderRadius: 10, padding: 24, flex: 1, boxShadow: '0 2px 12px #0001' }}>
          <h3 style={{ color: '#1e7d34', fontWeight: 700 }}>Feirantes</h3>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{feirantes.length}</div>
        </div>
        <div style={{ background: '#e6f7ff', borderRadius: 10, padding: 24, flex: 1, boxShadow: '0 2px 12px #0001' }}>
          <h3 style={{ color: '#2186eb', fontWeight: 700 }}>Boxes</h3>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{boxes.length}</div>
        </div>
        <div style={{ background: '#fff0f6', borderRadius: 10, padding: 24, flex: 1, boxShadow: '0 2px 12px #0001' }}>
          <h3 style={{ color: '#e74c3c', fontWeight: 700 }}>Produtos</h3>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{produtos.length}</div>
        </div>
      </div>
      <AdminAnalytics />
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', maxWidth: 600 }}>
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar feirante por nome ou CPF..." style={{ flex: 1, padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 18 }} />
        <button onClick={() => setBuscaAtiva(busca)} style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Pesquisar</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 12px #0001' }}>
        <h3 style={{ color: '#e67e22', fontWeight: 700, marginBottom: 18 }}>Resumo de Feirantes</h3>
        <table style={{ width: '100%', fontSize: 16, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th style={{ padding: 10, textAlign: 'left' }}>Nome</th>
              <th style={{ padding: 10, textAlign: 'left' }}>CPF</th>
              <th style={{ padding: 10, textAlign: 'left' }}>Box</th>
              <th style={{ padding: 10, textAlign: 'left' }}>Produtos</th>
              <th style={{ padding: 10, textAlign: 'left' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {feirantes.filter(f => {
              const termo = buscaAtiva.toLowerCase();
              if (!termo) return true;
              return (
                f.nome.toLowerCase().includes(termo) ||
                (f.cpf && f.cpf.includes(termo))
              );
            }).map(f => {
              // Busca todos os boxes do feirante (id puro ou objeto)
              const feiranteBoxes = boxes.filter(b => {
                if (b.feirante === f._id) return true;
                if (b.feirante && typeof b.feirante === 'object' && b.feirante._id === f._id) return true;
                return false;
              });
              // Para cada box, conta os produtos (id puro ou objeto)
              const boxInfo = feiranteBoxes.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {feiranteBoxes.map(b => {
                    const produtosBox = produtos.filter(p => {
                      if (p.box === b._id) return true;
                      if (p.box && typeof p.box === 'object' && p.box._id === b._id) return true;
                      return false;
                    });
                    return (
                      <li key={b._id} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 600 }}>{b.nome}</span>
                        <span style={{ color: '#888', fontSize: 13 }}> ({produtosBox.length} produto{produtosBox.length !== 1 ? 's' : ''})</span>
                        <div style={{ color: '#2186eb', fontSize: 13 }}>{b.localizacao}</div>
                      </li>
                    );
                  })}
                </ul>
              ) : '-';
              // Soma total de produtos do feirante
              const totalProdutos = feiranteBoxes.reduce((acc, b) => acc + produtos.filter(p => {
                if (p.box === b._id) return true;
                if (p.box && typeof p.box === 'object' && p.box._id === b._id) return true;
                return false;
              }).length, 0);
              return (
                <tr key={f._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>{f.nome}</td>
                  <td style={{ padding: 10 }}>{f.cpf}</td>
                  <td style={{ padding: 10 }}>{boxInfo}</td>
                  <td style={{ padding: 10 }}>{totalProdutos}</td>
                  <td style={{ padding: 10 }}>
                    <button onClick={() => window.location.href = `/admin/feirante/${f._id}`} style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
