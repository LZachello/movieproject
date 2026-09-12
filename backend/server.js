const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors    = require('cors')

const app  = express()
const PORT = 3000;

// Configurações essenciais
app.use(cors())         // Permite o React conectar com este servidor
app.use(express.json()) // Permite que o servidor entende os dados em JSON

const db = new sqlite3.Database('../database.db', (err) => {
    
    if (err) {

        console.error("Erro ao conectar ao Banco de Dados", err.message)
    } else {

        console.log("Conectado ao Banco de Dados com sucesso!")
    }
})

// Rota de teste
app.get('/teste', (req, res) => {

    res.json({mensagem: 'A API está funcionando e pronta para receber requisições!'})
})

// Rota POST
app.post('/Filmes', (req, res) => {

    const {titulo, genero, ano_lancamento, nota, comentario, data_assistido} = req.body
    const query = `INSERT INTO Filmes (titulo, genero, ano_lancamento, nota, comentario, data_assistido) VALUES (?, ?, ?, ?, ?, ?)`
    
    db.run(query, [titulo, genero, ano_lancamento, nota, comentario, data_assistido], function(err) {
        if (err) {

            return res.status(400).json({ erro: err.message })
        }
        res.status(201).json({

            mensagem: 'Filme cadastrado com sucesso!',
            id: this.lastID
        })
    })
})

// Rota GET
app.get('/Filmes', (req, res) => {

    const query = `SELECT * FROM Filmes ORDER BY id DESC` // Trás os filmes mais recentes primeiro

    db.all(query, [], (err, rows) => {

        if (err) {

            return res.status(500).json({ erro: err.message })
        }
        res.json(rows) // Retorna a lista de filmes
    })
})

// Rota DELETE
app.delete('/Filmes/:id', (req, res) => {

    const id    = req.params.id // Pega o ID do filme
    const query = `DELETE FROM Filmes WHERE id = ?`

    db.run(query, id, function(err) {

        if (err) {

            return res.status(500).json({ erro: err.message })
        }
        res.json({

            mensagem: 'Filme removido com sucesso!',
            linhasAfetadas: this.changes // Retorna quantas linhas foram afetadas
        })
    })
})

// Rota PUT
app.put('/Filmes/:id', (req, res) => {

    const id    = req.params.id // Pega o ID do filme
    const query = `UPDATE Filmes SET nota = ?, comentario = ? WHERE ID = ?`
    const { nota, comentario } = req.body

    db.run(query, [nota, comentario, id], function(err) {

        if (err) {

            return res.status(400).json({ erro: err.message })
        }
        res.json({

            mensagem: 'Filme atualizado com sucesso!',
            linhasAfetadas: this.changes
        })
    })
})

// Inicia o servidor
app.listen(PORT, () => {
    
    console.log(`Servidor rodando na porta https://localhost:${PORT}`)
})