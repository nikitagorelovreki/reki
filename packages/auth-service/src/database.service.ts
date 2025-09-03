import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private _knex: Knex;

  constructor(private readonly configService: ConfigService) {
    this._knex = knex({
      client: 'postgresql',
      connection: {
        host: this.configService.get('POSTGRES_HOST', 'localhost'),
        port: this.configService.get('POSTGRES_PORT', 5432),
        user: this.configService.get('POSTGRES_USER', 'postgres'),
        password: this.configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: this.configService.get('POSTGRES_DB', 'reki'),
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
    await this._knex.destroy();
  }
}
