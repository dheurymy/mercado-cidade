import React, { useState } from 'react';
import { feiranteLogin } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [cpf, setCpf] = useState('');

  // Função para formatar CPF com ponto e traço
  function formatarCpf(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  }
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const cpfNumeros = cpf.replace(/\D/g, '');
      const res = await feiranteLogin({ cpf: cpfNumeros, senha });
      // Salvar token/localStorage se necessário
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/feirante');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 32, borderRadius: 12, background: '#fff', boxShadow: '0 2px 16px #0002' }}>
      <h2 style={{ color: '#1e7d34', fontWeight: 900, marginBottom: 28 }}>Login de Feirante</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={e => setCpf(formatarCpf(e.target.value))}
          required
          maxLength={14}
          style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, letterSpacing: 2 }}
        />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
        <button type="submit" style={{ background: '#1e7d34', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 18, marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>Entrar</button>
      </form>
      <button onClick={() => navigate('/feirante-area')} style={{ marginTop: 18, background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Voltar</button>
      {erro && <div style={{ color: 'red', marginTop: 16 }}>{erro}</div>}
    </div>
  );
}

export default LoginPage;
