CREATE TABLE IF NOT EXISTS Filmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    genero TEXT,
    ano_lancamento INTEGER,
    nota INTEGER CHECK(nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_assistido DATE DEFAULT CURRENT_DATE
);