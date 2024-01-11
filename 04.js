const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(bodyParser.json());

const usersFilePath = 'users.json';

const initializeDatabase = async () => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify([]));
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database', error);
  }
};

app.use(async (req, res, next) => {
  await initializeDatabase();
  next();
});

const loadUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users', error);
    return [];
  }
};

const saveUsers = async (users) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users', error);
  }
};

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const users = await loadUsers();
    const userExists = users.some(user => user.username === username);
    if (!userExists) {
      users.push({ username, password });
      await saveUsers(users);
      res.send('註冊成功！<br><a href="/login">登入</a>');
    } else {
      res.send('註冊失敗，帳號已被使用過。<br><a href="/signup">重新註冊</a>');
    }
  } else {
    res.status(400).send('帳號和密碼是必填欄位');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const users = await loadUsers();
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      res.send('登入成功！<br><a href="/enter">進入系統</a>');
    } else {
      res.send('登入失敗，請檢查帳號密碼是否有錯。<br><a href="/login">重新登入</a>');
    }
  } else {
    res.status(400).send('帳號和密碼是必填欄位');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

