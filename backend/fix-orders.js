import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const cleanup = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;

  // ─── STEP 1: Remove duplicate subscriptions ───────────────────────────
  console.log('=== STEP 1: Removing duplicate subscriptions ===');

  const allSubs = await db.collection('subscriptions')
    .find({ status: 'active' })
    .sort({ createdAt: 1 })
    .toArray();

  const seen = new Map();
  const toDelete = [];

  for (const sub of allSubs) {
    const key = `${sub.user}_${sub.box}`;
    if (seen.has(key)) {
      toDelete.push(sub._id);
      console.log(`  → Duplicate found: sub ${sub._id} — will delete`);
    } else {
      seen.set(key, sub._id);
    }
  }

  if (toDelete.length > 0) {
    await db.collection('subscriptions').deleteMany({ _id: { $in: toDelete } });
    console.log(`  ✅ Deleted ${toDelete.length} duplicate subscription(s)\n`);
  } else {
    console.log('  ✅ No duplicates found\n');
  }

  // ─── STEP 2: Create missing orders ────────────────────────────────────
  console.log('=== STEP 2: Creating missing orders for existing subscriptions ===');

  const activeSubs = await db.collection('subscriptions')
    .find({ status: 'active' })
    .toArray();

  let created = 0;

  for (const sub of activeSubs) {
    const existingOrder = await db.collection('orders').findOne({ subscription: sub._id });

    if (!existingOrder) {
      const now = new Date();
      await db.collection('orders').insertOne({
        user: sub.user,
        subscription: sub._id,
        box: sub.box,
        status: 'confirmed',
        trackingNumber: '',
        carrier: 'MealExpress Delivery',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        deliveryAddress: {
          street: '',
          city: '',
          postalCode: '',
          country: 'Tunisia'
        },
        timeline: [
          { status: 'confirmed', label: 'Order confirmed', description: 'Your order has been validated', completed: true, timestamp: now },
          { status: 'preparing', label: 'Preparing', description: 'We are preparing your box', completed: false, timestamp: now },
          { status: 'shipped', label: 'Shipped', description: 'Your box has left our warehouse', completed: false, timestamp: now },
          { status: 'in_transit', label: 'In transit', description: 'Your box is on the way', completed: false, timestamp: now },
          { status: 'delivered', label: 'Delivered', description: 'Your box has been delivered', completed: false, timestamp: now }
        ],
        createdAt: now,
        updatedAt: now
      });
      console.log(`  ✅ Created order for subscription ${sub._id} (box: ${sub.box})`);
      created++;
    } else {
      console.log(`  ⏭️  Subscription ${sub._id} already has an order — skipping`);
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`  Orders created: ${created}`);
  console.log(`  Duplicates removed: ${toDelete.length}`);

  process.exit(0);
};

cleanup().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});