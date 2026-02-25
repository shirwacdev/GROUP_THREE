<<<<<<< HEAD
const expre``
=======
const express = require('express');
const mongoose = require('mongoose');

const adminRouter = require("./model/Admin")

const ensureValidId = (id) => mongoose.Types.ObjectId.isValid(id);



adminRouter.post('/', async (req, res) => {
  try {
    const { name, address, email } = req.body;

    if (!name || address === undefined || !email) {
      return res.status(400).json({ message: 'name, address, and email are required' });
    }

    const product = await Product.create({ name, address, email });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

>>>>>>> 0e13816244fb303e3b81188e14f286fad7be5ac8
