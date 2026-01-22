import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';


function ProdutoForm({ produto, onSave }) {
  const [nome, setNome] = useState(produto?.nome || '');
  const [descricao, setDescricao] = useState(produto?.descricao || '');
  const [preco, setPreco] = useState(produto?.preco ? String(produto.preco) : '');
  const [foto, setFoto] = useState(produto?.foto || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(produto?.foto || '');
  const fileInputRef = useRef();
  const [categoria, setCategoria] = useState(produto?.categoria?._id || '');
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setNome(produto?.nome || '');
    setDescricao(produto?.descricao || '');
    setPreco(produto?.preco ? String(produto.preco) : '');
    setFoto(produto?.foto || '');
    setPreview(produto?.foto || '');
    setFile(null);
    setCategoria(produto?.categoria?._id || '');
  }, [produto]);

  useEffect(() => {
    api.get('/api/categorias').then(res => {
      setCategorias(res.data.filter(c => c.tipo === 'produto'));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    let fotoUrl = foto;
    try {
      if (file) {
        // Converter arquivo para base64
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
        const base64 = await toBase64(file);
        const res = await api.post('/api/upload', { image: base64 });
        fotoUrl = res.data.url;
      }
      await onSave({ nome, descricao, preco: parseFloat(preco), foto: fotoUrl, categoria });
      if (!produto || !produto._id) {
        setNome('');
        setDescricao('');
        setPreco('');
        setFoto('');
        setPreview('');
        setFile(null);
        setCategoria('');
      }
    } catch (err) {
      setErro('Erro ao salvar produto.');
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleCapture = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24, fontSize: 18 }}>
      <label style={{ fontWeight: 600 }}>Nome do Produto:
        <input value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }} />
      </label>
      <label style={{ fontWeight: 600 }}>Descrição do Produto:
        <input value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }} />
      </label>
      <label style={{ fontWeight: 600 }}>Preço do Produto (R$):
        <input value={preco} onChange={e => setPreco(e.target.value)} type="number" min="0" step="0.01" required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }} />
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontWeight: 600 }}>Foto do Produto:</label>
        {preview && <img src={preview} alt="preview" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }} />}
        <label style={{ fontWeight: 500, marginBottom: 2 }}>Escolher do dispositivo:
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{ marginBottom: 4, fontSize: 16 }} />
        </label>
        <label style={{ fontWeight: 500, marginBottom: 2 }}>Tirar foto agora:
          <input type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ marginBottom: 4, fontSize: 16 }} />
        </label>
        <label style={{ fontWeight: 500 }}>Ou informe uma URL de imagem:
          <input value={foto} onChange={e => setFoto(e.target.value)} placeholder="URL da Imagem (opcional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, marginTop: 4, width: '100%' }} />
        </label>
      </div>
      <label style={{ fontWeight: 600 }}>Categoria do Produto:
        <select value={categoria} onChange={e => setCategoria(e.target.value)} required style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18, marginTop: 4, width: '100%' }}>
          <option value="">Selecione a categoria</option>
          {categorias.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
        </select>
      </label>
      <button type="submit" style={{ background: '#2186eb', color: '#fff', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: 20, cursor: 'pointer', marginTop: 8 }}>{produto && produto._id ? 'Salvar' : 'Adicionar'}</button>
      {erro && <div style={{ color: 'red', fontSize: 16 }}>{erro}</div>}
    </form>
  );
}

export default ProdutoForm;
