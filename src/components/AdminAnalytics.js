import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AdminAnalytics() {
  const [maisBuscados, setMaisBuscados] = useState([]);
  const [boxesMaisAcessados, setBoxesMaisAcessados] = useState([]);

  useEffect(() => {
    api.get('/api/products/analytics/mais-adicionados').then(res => setMaisBuscados(res.data));
    api.get('/api/products/analytics/boxes-mais-adicionados').then(res => setBoxesMaisAcessados(res.data));
  }, []);

  return (
    <div style={{ marginTop: 40, marginBottom: 40 }}>
      <h3 style={{ color: '#e67e22', fontWeight: 700, marginBottom: 18 }}>Produtos mais adicionados em listas</h3>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 32 }}>
        {maisBuscados.map(prod => (
          <div key={prod._id} style={{ background: '#fffbe6', borderRadius: 8, padding: 16, minWidth: 180, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontWeight: 700 }}>{prod.nome}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{prod.categoria?.nome}</div>
            <div style={{ color: '#1e7d34', fontWeight: 600 }}>Adicionados: {prod.adicionadosEmListas}</div>
          </div>
        ))}
        {maisBuscados.length === 0 && <div style={{ color: '#888' }}>Nenhum dado ainda.</div>}
      </div>
      <h3 style={{ color: '#e67e22', fontWeight: 700, marginBottom: 18 }}>Boxes com produtos mais adicionados em listas</h3>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {boxesMaisAcessados.map(box => (
          <div key={box._id} style={{ background: '#e6f7ff', borderRadius: 8, padding: 16, minWidth: 180, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontWeight: 700 }}>{box.nome}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{box.tipoEstabelecimento?.nome}</div>
            <div style={{ color: '#2186eb', fontWeight: 600 }}>Adicionados: {box.adicionadosEmListas}</div>
          </div>
        ))}
        {boxesMaisAcessados.length === 0 && <div style={{ color: '#888' }}>Nenhum dado ainda.</div>}
      </div>
    </div>
  );
}

export default AdminAnalytics;
