const express = require('express');
const { getDatabase } = require('../models/database');

const router = express.Router();

router.get('/status', (req, res) => {
  const currentTime = new Date().toISOString();
  console.log(`${currentTime} - GET /light/status`);
  const db = getDatabase();
  db.get("SELECT * FROM light_status ORDER BY id DESC LIMIT 1", [], (err, row) => {
    if (err) {
      console.error('Erro ao buscar status da luz:', err);
      return res.status(500).json({"error": err.message});
    }
    if (!row) {
      console.log('Nenhum status de luz encontrado');
      return res.json({
        "intensity": 0,
        "isOn": false
      });
    }
    console.log('Status da luz recuperado:', row);
    res.json({
      "intensity": row.intensity,
      "isOn": row.is_on === 1
    });
  });
});

router.post('/status', (req, res) => {
  const currentTime = new Date().toISOString();
  console.log(`${currentTime} - POST /light/status`);
  console.log('Requisição para atualizar status da luz recebida:', req.body);
  const { isOn } = req.body;
  const intensity = isOn ? 100 : 0;
  const db = getDatabase();
  const sql = "INSERT INTO light_status (intensity, is_on) VALUES (?, ?)";
  db.run(sql, [intensity, isOn ? 1 : 0], function(err) {
    if (err) {
      console.error('Erro ao atualizar status da luz:', err);
      return res.status(500).json({"error": err.message});
    }
    console.log('Status da luz atualizado com sucesso');
    res.json({
      "intensity": intensity,
      "isOn": isOn
    });
  });
});

module.exports = router;

