const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('your-database-uri', { useNewUrlParser: true, useUnifiedTopology: true });

const Post = mongoose.model('Post', {
  title: String,
  content: String,
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const posts = await Post.find();
  res.render('index', { posts });
});

app.post('/post', async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  await post.save();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

