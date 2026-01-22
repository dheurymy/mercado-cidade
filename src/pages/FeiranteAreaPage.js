import React from 'react';
import { Link } from 'react-router-dom';


function FeiranteAreaPage() {
  const btnStyle = {
    margin: '16px 0',
    width: '100%',
    padding: '18px 0',
    fontSize: 20,
    fontWeight: 700,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: '0 2px 8px #0001',
    transition: 'background 0.2s',
  };
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', padding: 32 }}>
      <h2 style={{ marginBottom: 32, color: '#1e7d34', fontWeight: 900 }}>Área do Feirante / Admin</h2>
      <Link to="/login">
        <button style={{ ...btnStyle, background: '#1e7d34', color: '#fff' }}>Login Feirante</button>
      </Link>
      <Link to="/register">
        <button style={{ ...btnStyle, background: '#2186eb', color: '#fff' }}>Cadastro Feirante</button>
      </Link>
      <Link to="/admin">
        <button style={{ ...btnStyle, background: '#e67e22', color: '#fff' }}>Login Administrador</button>
      </Link>
      <p style={{marginTop: 32, fontSize: 13, color: '#888'}}>Cadastro de administradores apenas via painel após login como admin.</p>
    </div>
  );
}

export default FeiranteAreaPage;
