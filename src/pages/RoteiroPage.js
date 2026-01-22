import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RoteiroPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const roteiro = location.state?.roteiro || [];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <h2>Roteiro Sugerido</h2>
      <button onClick={() => navigate('/catalog')} style={{ marginBottom: 24, background: '#eee', border: '1px solid #ccc', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>
        Voltar ao Catálogo
      </button>
      {roteiro.length === 0 && <div>Nenhum box encontrado para os produtos selecionados.</div>}
      <ol>
        {roteiro.map((item, idx) => (
          <li key={item.box._id} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: '#1e7d34' }}>{idx + 1}. {item.box.nome}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{item.box.localizacao}</div>
            <ul style={{ marginTop: 6 }}>
              {item.produtos.map(prod => (
                <li key={prod._id}>{prod.nome}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RoteiroPage;
