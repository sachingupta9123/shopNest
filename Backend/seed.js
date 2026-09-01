const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

const User = require('./model/User');
const Product = require('./model/Products');

const usersData = [
	{ name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin', isVerified: true },
	{ name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
	{ name: 'Bob Smith', email: 'bob@example.com', password: 'password123' }
];

const productsData = [
	{
		name: 'Wireless Headphones',
		description: 'Comfortable over-ear wireless headphones with noise cancellation.',
		price: 89.99,
		category: 'Electronics',
		stock: 120,
		imageUrl: 'https://placehold.co/600x400?text=Headphones',
		rating: 4.5,
		numReviews: 12
	},
	{
		name: 'Running Shoes',
		description: 'Lightweight running shoes for daily training and races.',
		price: 69.99,
		category: 'Footwear',
		stock: 75,
		imageUrl: 'https://placehold.co/600x400?text=Shoes',
		rating: 4.2,
		numReviews: 8
	},
	{
		name: 'Stainless Steel Water Bottle',
		description: 'Insulated water bottle keeps drinks cold for 24 hours.',
		price: 19.99,
		category: 'Accessories',
		stock: 250,
		imageUrl: 'https://placehold.co/600x400?text=Bottle',
		rating: 4.7,
		numReviews: 34
	}
];

async function seed() {
	try {
		await connectDB();

		// Clear existing data
		await User.deleteMany();
		await Product.deleteMany();

		// Hash passwords and insert users
		const usersToInsert = await Promise.all(
			usersData.map(async (u) => ({
				name: u.name,
				email: u.email,
				password: await bcrypt.hash(u.password, 10),
				role: u.role || 'user',
				isVerified: u.isVerified || false
			}))
		);

		const createdUsers = await User.insertMany(usersToInsert);
		console.log(`Inserted ${createdUsers.length} users.`);

		// Insert products
		const createdProducts = await Product.insertMany(productsData);
		console.log(`Inserted ${createdProducts.length} products.`);

		console.log('Seeding completed successfully.');
		process.exit(0);
	} catch (err) {
		console.error('Seeding failed:', err);
		process.exit(1);
	}
}

seed();

