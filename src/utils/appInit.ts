import { initDatabase } from '../../src/db/database';

// App initialization function
export const initializeApp = async () => {
  try {
    console.log('🚀 Initializing FunBox AI...');
    
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');
    
    console.log('🎉 FunBox AI ready!');
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    throw error;
  }
};