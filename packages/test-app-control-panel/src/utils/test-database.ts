import knex, { Knex } from 'knex';

export class TestDatabase {
  private db: Knex | null = null;

  async connect(): Promise<void> {
    if (this.db) return;

    this.db = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'reki',
        password: process.env.DB_PASSWORD || 'reki',
        database: process.env.DB_NAME || 'reki_test'
      },
      migrations: {
        directory: '/Users/nikita/Projects/reki/packages/core-persistence/database/migrations'
      }
    });
  }

  async migrate(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    await this.db.migrate.latest();
  }

  async cleanup(): Promise<void> {
    if (!this.db) return;
    
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Cleanup can only run in test environment');
    }
    
    // Clean up all tables
    await this.db('form_submissions').del();
    await this.db('form_templates').del();
    await this.db('device_maintenance').del();
    await this.db('device_status_history').del();
    await this.db('devices').del();
    await this.db('clients').del();
    await this.db('token_blacklist').del();
    await this.db('user_sessions').del();
    await this.db('users').del();
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      await this.db.destroy();
      this.db = null;
    }
  }

  getKnex(): Knex {
    if (!this.db) throw new Error('Database not connected');
    return this.db;
  }
}
