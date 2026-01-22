import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await api.post('/api/auth/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 32, borderRadius: 12, background: '#fff', boxShadow: '0 2px 16px #0002' }}>
      <h2 style={{ color: '#e67e22', fontWeight: 900, marginBottom: 28 }}>Login de Administrador</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
        <button type="submit" style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 18, marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>Entrar</button>
      </form>
      <button onClick={() => navigate('/feirante-area')} style={{ marginTop: 18, background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Voltar</button>
      {erro && <div style={{ color: 'red', marginTop: 16 }}>{erro}</div>}
    </div>
  );
}

export default AdminLoginPage;
