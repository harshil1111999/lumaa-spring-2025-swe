import { Client, Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

async function createDatabaseIfNotExists(
  dbName: string,
  config: {
    user: string;
    password: string;
    host: string;
    port: number;
  }
) {
  // Connect to the default 'postgres' database first
  const defaultClient = new Client({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await defaultClient.connect();
    
    // Check if database exists
    const checkDbQuery = `
      SELECT datname 
      FROM pg_catalog.pg_database 
      WHERE lower(datname) = lower($1)
    `;
    
    const res = await defaultClient.query(checkDbQuery, [dbName]);
    
    if (res.rowCount === 0) {
      // Database doesn't exist, create it
      console.log(`Database "${dbName}" does not exist. Creating...`);
      
      // Create database
      await defaultClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error('Error while creating database:', error);
    throw error;
  } finally {
    await defaultClient.end();
  }
}

async function tableExists(tableName: string): Promise<boolean> {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = $1
      );
    `, [tableName]);
    return result.rows[0].exists;
  }
  
  async function createTables() {
    const client = await pool.connect();
  
    try {
      // Start transaction
      await client.query('BEGIN');
  
      // Check and create users table
      const hasUsersTable = await tableExists('users');
      if (!hasUsersTable) {
        console.log('Creating users table...');
        await client.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Users table created successfully');
      } else {
        console.log('Users table already exists');
      }
  
      // Check and create tasks table
      const hasTasksTable = await tableExists('tasks');
      if (!hasTasksTable) {
        console.log('Creating tasks table...');
        await client.query(`
          CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            is_complete BOOLEAN DEFAULT FALSE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Tasks table created successfully');
      } else {
        console.log('Tasks table already exists');
      }
  
      // Commit transaction
      await client.query('COMMIT');
      console.log('Database setup completed successfully');
  
    } catch (error) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      console.error('Error setting up database:', error);
      throw error;
  
    } finally {
      // Release the client back to the pool
      client.release();
      // await pool.end();
    }
  }
  
  // Function to handle adding new columns to existing tables
  async function addNewColumnsIfNeeded() {
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // Check if column exists before adding it
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'tasks' 
          AND column_name = 'priority'
        );
      `);
  
      if (!result.rows[0].exists) {
        console.log('Adding priority column to tasks table...');
        await client.query(`
          ALTER TABLE tasks 
          ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
        `);
        console.log('Priority column added successfully');
      }
  
      await client.query('COMMIT');
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding new columns:', error);
      throw error;
  
    } finally {
      client.release();
    }
  }
  
  // Main function to run all database setup operations
  async function setupDatabase() {
    try {
      await createDatabaseIfNotExists('task_manager', {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
      });
      await createTables();
      await addNewColumnsIfNeeded();
      console.log('Database setup completed successfully');
    } catch (error) {
      console.error('Database setup failed:', error);
      process.exit(1);
    }
  }
  
  // Run the setup
  setupDatabase();