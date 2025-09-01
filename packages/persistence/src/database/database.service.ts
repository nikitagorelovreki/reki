import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private _knex: Knex;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    // Динамически импортируем только Knex с PostgreSQL
    const { default: knex } = await import('knex');

    // Создаем конфигурацию только для PostgreSQL
    const config: Knex.Config = {
      client: 'pg',
      connection: {
        host: this.configService.get('POSTGRES_HOST', 'localhost'),
        port: this.configService.get('POSTGRES_PORT', 5432),
        user: this.configService.get('POSTGRES_USER', 'reki'),
        password: this.configService.get('POSTGRES_PASSWORD', 'reki'),
        database: this.configService.get('POSTGRES_DB', 'reki'),
      },
      pool: {
        min: 2,
        max: 10,
      },
    };

    this._knex = knex(config);
  }

  onModuleDestroy(): void {
    if (this._knex) {
      this._knex.destroy();
    }
  }

  get knex(): Knex {
    return this._knex;
  }
}
