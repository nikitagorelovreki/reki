import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { KNEX_TOKEN } from './knex.decorator';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.local'],
  })],
  providers: [
    {
      provide: DatabaseService,
      useFactory: (configService: ConfigService) => {
        return new DatabaseService(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: KNEX_TOKEN,
      useFactory: (databaseService: DatabaseService) => databaseService.knex,
      inject: [DatabaseService],
    },
  ],
  exports: [KNEX_TOKEN, DatabaseService],
})
export class PersistenceCommonsModule {}
