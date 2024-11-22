const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const DBSOURCE = "db.sqlite";

let db;

const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DBSOURCE, (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err.message);
                reject(err);
            } else {
                console.log('Conectado ao banco de dados SQLite.');
                db.run(`CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username text UNIQUE, 
                    password text, 
                    CONSTRAINT username_unique UNIQUE (username)
                    )`,
                (err) => {
                    if (err) {
                        console.error('Erro ao criar tabela user:', err.message);
                    } else {
                        console.log('Tabela user criada ou já existente');
                        // Inserir usuários padrão apenas se a tabela foi criada agora
                        db.get("SELECT COUNT(*) as count FROM user", (err, row) => {
                            if (err) {
                                console.error('Erro ao verificar usuários existentes:', err.message);
                            } else if (row.count === 0) {
                                var insert = 'INSERT INTO user (username, password) VALUES (?,?)';
                                db.run(insert, ["admin", bcrypt.hashSync("admin123", 10)]);
                                db.run(insert, ["user", bcrypt.hashSync("user123", 10)]);
                                console.log('Usuários padrão inseridos');
                            }
                        });
                    }
                });  
                db.run(`CREATE TABLE IF NOT EXISTS light_status (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    intensity INTEGER,
                    is_on BOOLEAN
                    )`,
                (err) => {
                    if (err) {
                        console.error('Erro ao criar tabela light_status:', err.message);
                    } else {
                        console.log('Tabela light_status criada ou já existente');
                        // Inserir status inicial apenas se a tabela foi criada agora
                        db.get("SELECT COUNT(*) as count FROM light_status", (err, row) => {
                            if (err) {
                                console.error('Erro ao verificar status de luz existente:', err.message);
                            } else if (row.count === 0) {
                                var insert = 'INSERT INTO light_status (intensity, is_on) VALUES (?,?)';
                                db.run(insert, [50, false]);
                                console.log('Status de luz inicial inserido');
                            }
                        });
                    }
                });
                resolve(db);
            }
        });
    });
};

module.exports = {
    initializeDatabase,
    getDatabase: () => {
        if (!db) {
            throw new Error('Database not initialized. Call initializeDatabase first.');
        }
        return db;
    }
};

