const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const lightRoutes = require('./routes/light');
const { initializeDatabase } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', // Permite todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'Servidor está funcionando!' });
});

// Inicializa o banco de dados
initializeDatabase()
    .then(() => {
        // Rotas
        app.use('/auth', authRoutes);
        app.use('/light', lightRoutes);

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao inicializar o banco de dados:', err);
    });

