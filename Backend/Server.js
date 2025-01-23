const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Define book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageURL: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
});

// User schema for watchlist (only for books)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: {
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  },
});

const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);

// Routes

// Add book to watchlist
app.post('/api/addtowatchlist', async (req, res) => {
  try {
    const { username, item } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newBook = await Book.create(item);
    user.watchlist.books.push(newBook._id);

    await user.save();
    res.status(200).json({ message: 'Book added to watchlist', newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to watchlist', error });
  }
});

// Get user's watchlist
app.get('/api/watchlist', async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username }).populate('watchlist.books');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watchlist', error });
  }
});

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Protected route
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: 'Welcome to the protected route', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
