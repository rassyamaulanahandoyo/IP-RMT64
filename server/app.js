'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { Brand, User } = require('./models');
const { comparePassword } = require('./helpers/bcrypts');
const { generateToken } = require('./helpers/jwt');
const midtransClient = require('midtrans-client');
const aiRouter = require('./routes/ai');

const app = express();

app.use('/ai', aiRouter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/brands', async (req, res) => {
    try {
        const { brand, type, price, description, coverUrl } = req.body;
        const newBrand = await Brand.create({ brand, type, price, description, coverUrl });
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
        const { brand, type, price, description, coverUrl } = req.body;
        const [updated] = await Brand.update({ brand, type, price, description, coverUrl }, { where: { id } });
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
            return res.status(400).json({ message: 'Email dan Password wajib diisi' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !comparePassword(password, user.password)) {
            return res.status(401).json({ message: 'Email atau Password salah' });
        }

        const access_token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.status(200).json({
            access_token,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        next(err);
    }
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: 'Email wajib diisi' });
    if (!password) return res.status(400).json({ message: 'Password wajib diisi' });

    const newUser = await User.create({ email, password, role: 'staff' });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    } else if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors[0].message });
    } else {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

app.post('/checkout', async (req, res) => {
    try {
        const { items, totalPrice, customer } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Keranjang kosong!" });
        }

        const parameter = {
            transaction_details: {
                order_id: "ORDER-" + Math.floor(Math.random() * 999999),
                gross_amount: totalPrice,
            },
            customer_details: {
                first_name: customer?.name || "Guest",
                email: customer?.email || "guest@example.com",
            },
            item_details: items.map(item => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
                name: item.name,
            })),
        };

        const transaction = await snap.createTransaction(parameter);

        res.status(200).json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });
    } catch (err) {
        console.error("Checkout error:", err);
        res.status(500).json({
            message: "Checkout gagal",
            error: err.message,
        });
    }
});

app.use((err, req, res, next) => {
    console.error("Internal error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
