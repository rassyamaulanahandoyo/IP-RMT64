'use strict';

const express = require('express');
const { Brand, Item, User } = require('./models');
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

app.post('/items', async (req, res) => {
  try {
    const { name, price, stock, BrandId } = req.body;
    const item = await Item.create({
      name,
      price,
      stock,
      BrandId,
      imgUrl: ''
    });
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    const filter = {};
    if (req.query.name) {
      filter.name = { [Op.iLike]: `%${req.query.name}%` };
    }
    if (req.query.BrandId) {
      filter.BrandId = +req.query.BrandId;
    }

    const { count, rows } = await Item.findAndCountAll({
      where: filter,
      include: Brand,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    });

    res.status(200).json({
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      items: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const item = await Item.findByPk(id, { include: Brand });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const { name, description, price, stock, BrandId } = req.body;
    const [updated] = await Item.update({ name, description, price, stock, BrandId }, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    const updatedItem = await Item.findByPk(id);
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const deleted = await Item.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/items/:id/image', async (req, res) => {
  try {
    const id = +req.params.id;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploaded = await cloudinary.uploader.upload(base64String, { folder: 'branded-things' });

    await Item.update({ imgUrl: uploaded.secure_url }, { where: { id } });
    const updatedItem = await Item.findByPk(id);

    res.status(200).json(updatedItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw { name: 'Login Input Error' };

    const user = await User.findOne({ where: { email } });
    if (!user || !comparePassword(password, user.password)) {
      throw { name: 'Login Error' };
    }

    const access_token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({ access_token, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

app.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw { name: 'Login Input Error' };

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
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
