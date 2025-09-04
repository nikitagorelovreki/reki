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
    
    // Clean up in correct order (respecting foreign keys)
    await this.db('form_entries').del();
    await this.db('form_templates').del();
    await this.db('user_roles').del();
    await this.db('role_permissions').del();
    await this.db('devices').del();
    await this.db('clients').del();
    await this.db('users').del();
    await this.db('roles').del();
    await this.db('permissions').del();
    await this.db('clinics').del();
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
