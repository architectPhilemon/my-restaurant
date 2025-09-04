import mongoose from 'mongoose';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';

// Connect to MongoDB
export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Seed database if needed
    await seedDatabase();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Seed database with initial data
export const seedDatabase = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@restaurant.com',
        password: 'admin123', // Will be hashed by the model
        phone: '+254700000000',
        role: 'admin',
        loyaltyPoints: 0
      });
      
      await adminUser.save();
      console.log('✅ Admin user created');
    }

    // Check if menu items exist
    const menuCount = await MenuItem.countDocuments();
    
    if (menuCount === 0) {
      const menuItems = [
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          price: 1200,
          category: 'Pizza',
          available: true,
          ingredients: ['tomato sauce', 'mozzarella', 'basil', 'pizza dough'],
          preparationTime: 20
        },
        {
          name: 'Chicken Burger',
          description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
          price: 800,
          category: 'Burgers',
          available: true,
          ingredients: ['chicken breast', 'lettuce', 'tomato', 'burger bun', 'special sauce'],
          preparationTime: 15
        },
        {
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with caesar dressing and croutons',
          price: 600,
          category: 'Salads',
          available: true,
          ingredients: ['romaine lettuce', 'caesar dressing', 'croutons', 'parmesan'],
          preparationTime: 10
        },
        {
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake with chocolate frosting',
          price: 400,
          category: 'Desserts',
          available: true,
          ingredients: ['chocolate', 'flour', 'sugar', 'eggs', 'butter'],
          preparationTime: 5
        },
        {
          name: 'Beef Steak',
          description: 'Grilled beef steak with herbs and garlic',
          price: 1800,
          category: 'Main Course',
          available: true,
          ingredients: ['beef steak', 'herbs', 'garlic', 'olive oil'],
          preparationTime: 25
        },
        {
          name: 'Fish & Chips',
          description: 'Crispy battered fish with golden fries',
          price: 1000,
          category: 'Main Course',
          available: true,
          ingredients: ['fish fillet', 'potatoes', 'batter', 'oil'],
          preparationTime: 18
        }
      ];

      await MenuItem.insertMany(menuItems);
      console.log('✅ Menu items seeded');
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
};

// Graceful shutdown
export const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
};