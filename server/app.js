'use strict';

const express = require('express');
const { Brand, User } = require('./models');
const { comparePassword } = require('./helpers/bcrypts');
const { generateToken } = require('./helpers/jwt');
const cloudinary = require('./helpers/cloudinary');
const { Op } = require('sequelize');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/brands', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newBrand = await Brand.create({ name, description });
        res.status(201).json(newBrand);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/brands', async (req, res) => {
    try {
        const brands = await Brand.findAll({ order: [['id', 'ASC']] });
        res.status(200).json(brands);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/brands/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).json({ error: 'Brand not found' });
        res.status(200).json(brand);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/brands/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        const { name, description } = req.body;
        const [updated] = await Brand.update({ name, description }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Brand not found' });
        const updatedBrand = await Brand.findByPk(id);
        res.status(200).json(updatedBrand);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/brands/:id', async (req, res) => {
    try {
        const id = +req.params.id;
        const deleted = await Brand.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: 'Brand not found' });
        res.status(200).json({ message: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw { name: 'Login Input Error' };
        }

        // Cari user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw { name: 'Login Error' };
        }

        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw { name: 'Login Error' };
        }

        const access_token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.status(200).json({
            access_token,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        next(err);
    }
});

app.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const newUser = await User.create({
            email,
            password,
            role: 'staff'
        });

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        });
        app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    } catch (err) {
        next(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
