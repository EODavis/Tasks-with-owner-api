const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModels');

const SALT_ROUNDS =10;

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN ||'1h' }
    );
}

async function register(req, res, next) {
    try {
        const { username, email, password } = req.body;

        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(404).json({ success: false, message: 'Username is required' });
        }

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ success: false, message: 'A valid email is required' });
        }

        if (!password || typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const existing = await userModel.getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await userModel.createUser({ username, email, passwordHash });
        const token = generateToken(newUser);

        res.status(201).json({ success: true, data: newUser, token });
    } catch (err) {
        next(err);
    }

}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success:false, message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: { id: user.id, username: user.username, email: user.email },
            token,
        });
    } catch (err) {
        next(err);
    }

}

module.exports = { register, login };