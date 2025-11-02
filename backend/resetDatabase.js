const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    console.log('⚠️  WARNING: This will delete ALL data from the database!');
    
    // Get all collections
    const collections = await mongoose.connection.db.collections();
    
    console.log(`\n📊 Found ${collections.length} collection(s):`);
    collections.forEach(col => console.log(`   - ${col.collectionName}`));
    
    // Delete all documents from each collection
    console.log('\n🗑️  Deleting all documents...');
    
    for (const collection of collections) {
      const result = await collection.deleteMany({});
      console.log(`   ✓ Deleted ${result.deletedCount} document(s) from ${collection.collectionName}`);
    }
    
    console.log('\n✅ Database reset complete! All data has been deleted.');
    console.log('🔌 Disconnecting...\n');
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
