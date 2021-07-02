import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateMediaDto } from './dto/create-media.dto';
import { ToggleVisibilityDto } from './dto/toggle-visibility.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media)
    private readonly mediaEntity: typeof Media,
    private sequelize: Sequelize
  ) {}

  create(createMediaDto: CreateMediaDto) {
    return this.mediaEntity.create(createMediaDto)
  }

  async toggleVisibility(toggleVisibilityDto: ToggleVisibilityDto): Promise<Media> {
    const { hashed_id, active } = toggleVisibilityDto
    const media = await this.mediaEntity.findOne({
      where: {
        hashed_id: hashed_id
      }
    })
    return await media.update({ active: active })
  }

  async updateTotalPlays(updateMediaDto: UpdateMediaDto): Promise<Media> {
    const { hashed_id } = updateMediaDto

    const media = await this.mediaEntity.findOne({
      where: {
        hashed_id: hashed_id
      }
    })

    await media.increment('totalPlays')
    
    await media.reload()

    return media 
  }

  async findAll() {
    return await this.mediaEntity.findAll()
  }

  async findAllActiveMedia() {
    return await this.mediaEntity.findAll({
      where: {active: true}
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
