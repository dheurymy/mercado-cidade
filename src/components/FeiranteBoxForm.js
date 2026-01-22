import React, { useState, useEffect } from 'react';
import api from '../services/api';

function FeiranteBoxForm({ box, onSave }) {
  const [nome, setNome] = useState(box?.nome || '');
  const [descricao, setDescricao] = useState(box?.descricao || '');
  const [localizacao, setLocalizacao] = useState(box?.localizacao || '');
  const [tipoEstabelecimento, setTipoEstabelecimento] = useState(box?.tipoEstabelecimento?._id || '');
  const [tipos, setTipos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/api/categorias').then(res => {
      setTipos(res.data.filter(c => c.tipo === 'estabelecimento'));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await onSave({ nome, descricao, localizacao, tipoEstabelecimento });
    } catch (err) {
      setErro('Erro ao salvar box.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24, fontSize: 18 }}>
      <label style={{ fontWeight: 600 }}>Nome do Box:
        <input value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }} />
      </label>
      <label style={{ fontWeight: 600 }}>Descrição do Box:
        <input value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }} />
      </label>
      <label style={{ fontWeight: 600 }}>Localização do Box:
        <input value={localizacao} onChange={e => setLocalizacao(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }} />
      </label>
      <label style={{ fontWeight: 600 }}>Tipo de Estabelecimento:
        <select value={tipoEstabelecimento} onChange={e => setTipoEstabelecimento(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }}>
          <option value="">Selecione o tipo</option>
          {tipos.map(t => <option key={t._id} value={t._id}>{t.nome}</option>)}
        </select>
      </label>
      <button type="submit" style={{ background: '#1e7d34', color: '#fff', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: 20, cursor: 'pointer', marginTop: 8 }}>Salvar</button>
      {erro && <div style={{ color: 'red', fontSize: 16 }}>{erro}</div>}
    </form>
  );
}

export default FeiranteBoxForm;
