const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../models/database');

const router = express.Router();

router.post('/register', async (req, res) => {
  const currentTime = new Date().toISOString();
  console.log(`${currentTime} - POST /auth/register`);
  console.log('Requisição de registro recebida:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password são obrigatórios" });
  }

  try {
    const db = await getDatabase();
    console.log('Conexão com o banco de dados estabelecida');
    
    db.get("SELECT * FROM user WHERE username = ?", [username], async (err, user) => {
      if (err) {
        console.error('Erro ao verificar usuário existente:', err);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      
      if (user) {
        console.log('Usuário já existe:', username);
        return res.status(400).json({ error: "Usuário já existe" });
      }
      
      console.log('Iniciando hash da senha');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Senha hash gerada com sucesso');
      
      db.run("INSERT INTO user (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) {
          console.error('Erro ao inserir novo usuário:', err);
          return res.status(500).json({ error: "Erro ao criar usuário" });
        }
        console.log('Novo usuário criado com sucesso:', username);
        res.status(201).json({ message: "Usuário criado com sucesso" });
      });
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados" });
  }
});

router.post('/login', async (req, res) => {
  const currentTime = new Date().toISOString();
  console.log(`${currentTime} - POST /auth/login`);
  console.log('Requisição de login recebida:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password são obrigatórios" });
  }

  try {
    const db = await getDatabase();
    console.log('Conexão com o banco de dados estabelecida');
    
    db.get("SELECT * FROM user WHERE username = ?", [username], (err, user) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      
      if (!user) {
        console.log('Usuário não encontrado:', username);
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      
      console.log('Iniciando verificação de senha');
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Erro ao comparar senhas:', err);
          return res.status(500).json({ error: "Erro ao verificar senha" });
        }
        
        if (result) {
          console.log('Senha correta, gerando token');
          const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'YOUR_SECRET_KEY', { expiresIn: '1h' });
          console.log('Login bem-sucedido:', username);
          res.json({ token });
        } else {
          console.log('Senha incorreta para o usuário:', username);
          res.status(400).json({ error: "Senha incorreta" });
        }
      });
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados" });
  }
});

module.exports = router;

