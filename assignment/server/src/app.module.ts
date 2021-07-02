import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
    dialect: 'mssql',
    host: '127.0.0.1',
    port: 1433,
    username: 'sa',
    password: 'MyPass@word',
    database: 'TestDb',
    autoLoadModels: true,
    synchronize: true,
  }),
    MediaModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

