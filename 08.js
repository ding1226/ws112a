const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const dbFilePath = 'contacts.json';

const initializeDatabase = async () => {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify([]));
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database', error);
  }
};

app.use(async (req, res, next) => {
  await initializeDatabase();
  next();
});

const loadContacts = async () => {
  try {
    const data = await fs.readFile(dbFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading contacts', error);
    return [];
  }
};

const saveContacts = async (contacts) => {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts', error);
  }
};

app.get('/contacts', async (req, res) => {
  const contacts = await loadContacts();
  res.json(contacts);
});

app.get('/contacts/:id', async (req, res) => {
  const contacts = await loadContacts();
  const contact = contacts[req.params.id];
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).send('Contact not found');
  }
});

app.post('/contacts', async (req, res) => {
  const { name, phone } = req.body;
  if (name && phone) {
    const contacts = await loadContacts();
    const newContact = { name, phone };
    contacts.push(newContact);
    await saveContacts(contacts);

    // Broadcast the new contact to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newContact));
      }
    });

    res.json(newContact);
  } else {
    res.status(400).send('Name and phone are required');
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  loadContacts().then(contacts => {
    ws.send(JSON.stringify(contacts));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

