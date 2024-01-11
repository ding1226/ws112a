const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const users = await loadUsers();
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      // Create a session variable to store user information
      req.session.user = user;
      res.send('登入成功！<br><a href="/enter">進入系統</a>');
    } else {
      res.send('登入失敗，請檢查帳號密碼是否有錯。<br><a href="/login">重新登入</a>');
    }
  } else {
    res.status(400).send('帳號和密碼是必填欄位');
  }
});

app.get('/enter', (req, res) => {
  if (req.session.user) {
    res.send(`進入系統，歡迎 ${req.session.user.username}！`);
  } else {
    res.redirect('/login');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

