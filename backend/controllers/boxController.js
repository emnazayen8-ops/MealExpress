import Box from '../models/Box.js';
import Order from '../models/Order.js';
import Subscription from '../models/Subscription.js';

export const getBoxes = async (req, res) => {
  try {
    const boxes = await Box.find({ isActive: true });  // ← Filtre ici
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBoxById = async (req, res) => {
  try {
    const box = await Box.findOne({ 
      _id: req.params.id,
      isActive: true  // ← Ajoute ce filtre
    });
    if (!box) {
      return res.status(404).json({ message: 'Box not found' });
    }
    res.json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBox = async (req, res) => {
  try {
    const { name, description, price, interval } = req.body;
    const box = await Box.create({
      name,
      description,
      price,
      interval: interval || 'monthly',
      image: req.file ? req.file.path : '',
      isActive: true  // ← Ajoute ceci
    });
    res.status(201).json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBox = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id);
    if (!box) {
      return res.status(404).json({ message: 'Box not found' });
    }

    box.name = req.body.name || box.name;
    box.description = req.body.description || box.description;
    box.price = req.body.price || box.price;
    box.interval = req.body.interval || box.interval;
    
    if (req.file) {
      box.image = req.file.path;
    }

    const updatedBox = await box.save();
    res.json(updatedBox);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBox = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id);
    if (!box) {
      return res.status(404).json({ message: 'Box not found' });
    }

    // Soft delete : marquer comme inactive
    box.isActive = false;
    await box.save();

    res.json({ message: 'Box deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};