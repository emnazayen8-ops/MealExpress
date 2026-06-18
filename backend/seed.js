import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Box from './models/Box.js';
import Product from './models/Product.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Box.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    // Create boxes
    const box1 = await Box.create({
      name: 'Découverte Tunisienne',
      description: 'A curated selection of iconic Tunisian flavors to introduce you to the rich culinary heritage of Tunisia. Perfect for first-time explorers.',
      price: 29.99,
      interval: 'monthly',
      image: ''
    });

    const box2 = await Box.create({
      name: 'Premium Terroir',
      description: 'The finest artisanal products from Tunisian terroir. Extra virgin olive oil, rare honey, and organic specialties for connoisseurs.',
      price: 49.99,
      interval: 'monthly',
      image: ''
    });

    const box3 = await Box.create({
      name: 'Snack Tunisien',
      description: 'A delightful mix of traditional and modern Tunisian snacks. From jarred chakchouka to contemporary treats, perfect for any time of day.',
      price: 19.99,
      interval: 'monthly',
      image: ''
    });

    console.log('Boxes created');

    // Create products for Box 1
    await Product.create([
      { box: box1._id, name: 'Harissa Traditionnelle', description: 'Authentic Tunisian harissa paste, spicy and flavorful, made from sun-dried peppers and spices.', image: '' },
      { box: box1._id, name: 'Biscuits Traditionnels', description: 'Handcrafted traditional Tunisian biscuits, perfect with coffee or tea.', image: '' },
      { box: box1._id, name: 'Dattes Deglet Nour', description: 'Premium Deglet Nour dates from the oases of Tunisia, naturally sweet and caramel-like.', image: '' },
      { box: box1._id, name: 'Confitures Artisanales', description: 'Homemade jams made from local Tunisian fruits with traditional recipes.', image: '' }
    ]);

    // Create products for Box 2
    await Product.create([
      { box: box2._id, name: 'Huile d\'Olive Extra Vierge', description: 'Cold-pressed extra virgin olive oil from ancient Tunisian olive groves, rich and fruity.', image: '' },
      { box: box2._id, name: 'Miel Artisanal', description: 'Rare artisanal honey harvested from wildflowers in the Tunisian countryside.', image: '' },
      { box: box2._id, name: 'Produits Bio Locaux', description: 'Certified organic products sourced directly from Tunisian farmers and producers.', image: '' },
      { box: box2._id, name: 'Épices Rares', description: 'Hard-to-find Tunisian spices that bring authentic North African flavors to your kitchen.', image: '' }
    ]);

    // Create products for Box 3
    await Product.create([
      { box: box3._id, name: 'Chakchouka en Bocal', description: 'Ready-to-eat jarred chakchouka, a beloved Tunisian pepper and tomato stew.', image: '' },
      { box: box3._id, name: 'Snacks Salés Traditionnels', description: 'Classic Tunisian savory snacks, crispy and seasoned with local spices.', image: '' },
      { box: box3._id, name: 'Snacks Modernes', description: 'Contemporary Tunisian snack creations blending tradition with modern taste.', image: '' }
    ]);

    console.log('Products created');
    console.log('✅ Seed data inserted successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedData();