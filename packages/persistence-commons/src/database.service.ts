import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private _knex: Knex;

  constructor(private readonly configService: ConfigService) {
    this._knex = knex({
      client: 'pg',
      connection: {
        host: this.configService.get('POSTGRES_HOST') || 'localhost',
        port: parseInt(this.configService.get('POSTGRES_PORT') || '5432'),
        user: this.configService.get('POSTGRES_USER') || 'reki',
        password: this.configService.get('POSTGRES_PASSWORD') || 'reki',
        database: this.configService.get('POSTGRES_DB') || 'reki',
      },
      pool: {
        min: 2,
        max: 10,
      },
    });
  }

  get knex(): Knex {
    return this._knex;
  }

  async onModuleDestroy() {
    if (this._knex) {
      await this._knex.destroy();
    }
  }
}
