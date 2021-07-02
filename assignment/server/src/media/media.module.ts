import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './entities/media.entity';
import { Tag } from './entities/tags.entity';

@Module({
  imports: [SequelizeModule.forFeature([Media, Tag])],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
