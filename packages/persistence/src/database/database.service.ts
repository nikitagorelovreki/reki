import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private _knex: Knex;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this._knex = knex({
      client: 'pg',
      connection: {
        host: this.configService.get('POSTGRES_HOST', 'localhost'),
        port: this.configService.get('POSTGRES_PORT', 5432),
        user: this.configService.get('POSTGRES_USER', 'cuis'),
        password: this.configService.get('POSTGRES_PASSWORD', 'cuis'),
        database: this.configService.get('POSTGRES_DB', 'cuis'),
      },
      pool: {
        min: 2,
        max: 10,
      },
    });
  }

  onModuleDestroy() {
    if (this._knex) {
      this._knex.destroy();
    }
  }

  get knex(): Knex {
    return this._knex;
  }
}
