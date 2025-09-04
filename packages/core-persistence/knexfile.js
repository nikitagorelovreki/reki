// Knex configuration for migrations
module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'reki',
      password: process.env.DB_PASSWORD || 'reki',
      database: process.env.DB_NAME || 'reki_test'
    },
    migrations: {
      directory: './database/migrations'
    }
  },
  
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'reki',
      password: process.env.DB_PASSWORD || 'reki',
      database: process.env.DB_NAME || 'reki'
    },
    migrations: {
      directory: './database/migrations'
    }
  },
  
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations'
    }
  }
};
