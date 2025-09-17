import postgres from 'postgres';

async function createDatabase() {
  // Connect to postgres database (default) to create our target database
  const sql = postgres('postgresql://postgres:jaijai@localhost:5432/postgres');
  
  try {
    // Check if database exists
    const result = await sql`
      SELECT 1 FROM pg_database WHERE datname = 'Data_collection'
    `;
    
    if (result.length === 0) {
      // Database doesn't exist, create it
      await sql.unsafe('CREATE DATABASE "Data_collection"');
      console.log('Database "Data_collection" created successfully!');
    } else {
      console.log('Database "Data_collection" already exists.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await sql.end();
  }
}

createDatabase();
