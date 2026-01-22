// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create users table
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Registration logic
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const stmt = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
    stmt.run(username, password, function(err) {
        if (err) {
            return res.status(500).send('Error registering user.');
        }
        res.status(201).send(`User ${username} registered!`);
    });
    stmt.finalize();
});

// Login logic
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).send('Error logging in.');
        }
        if (row) {
            res.send(`Welcome back, ${username}!`);
        } else {
            res.status(401).send('Invalid username or password.');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});