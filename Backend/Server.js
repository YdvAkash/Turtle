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


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    books: { type: Array, required: false },
    Rate: { type: Number, required: false },
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/addbook', async (req, res) => {
    try {
        const { username, books } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        // If user not found, return an error message
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the book to the user's list of books (or any other relevant data)
        user.books.push(books);

        // Save the updated user data
        await user.save();

        // Return success response
        res.status(200).json({ message: 'Book added successfully', user });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Internal server error', error });
    }
});

app.get('/api/getbooks', async (req, res) => {
    try {
        const { username } = req.query; // Use `req.query` for GET requests

        // Validate username
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user's books
        return res.status(200).json({ books: user.books || [] }); // Assuming `books` is an array field in User schema
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});



// Protected Route
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
