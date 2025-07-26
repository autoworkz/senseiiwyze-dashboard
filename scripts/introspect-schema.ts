import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function introspectAuthSchema() {
  try {
    // Get column information for better_auth tables
    const result = await pool.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'better_auth'
      AND table_name IN ('user', 'account', 'session', 'verification')
      ORDER BY table_name, ordinal_position;
    `);

    console.log('Existing Better Auth Schema:');
    console.log(JSON.stringify(result.rows, null, 2));

    // Also get table relationships
    const constraints = await pool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'better_auth'
        AND tc.table_name IN ('user', 'account', 'session', 'verification');
    `);

    console.log('\nTable Relationships:');
    console.log(JSON.stringify(constraints.rows, null, 2));

  } catch (error) {
    console.error('Error introspecting schema:', error);
  } finally {
    await pool.end();
  }
}

// Run the introspection
introspectAuthSchema();