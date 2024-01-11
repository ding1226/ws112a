const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('contacts.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database opened');
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT
      )
    `);
  }
});

app.get('/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      console.error('Error fetching contacts', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.get('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  db.get('SELECT * FROM contacts WHERE id = ?', [contactId], (err, row) => {
    if (err) {
      console.error('Error fetching contact', err);
      res.status(500).send('Internal Server Error');
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send('Contact not found');
    }
  });
});

app.post('/contacts', (req, res) => {
  const { name, phone } = req.body;
  if (name && phone) {
    db.run('INSERT INTO contacts (name, phone) VALUES (?, ?)', [name, phone], (err) => {
      if (err) {
        console.error('Error adding contact', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json({ name, phone });
      }
    });
  } else {
    res.status(400).send('Name and phone are required');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
