import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ToggleVisibilityDto } from './dto/toggle-visibility.dto';
import { Media } from './entities/media.entity';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Patch('toggle')
  async toggleVisibility(@Body() toggleVisibilityDto: ToggleVisibilityDto): Promise<Media> {
    return await this.mediaService.toggleVisibility(toggleVisibilityDto);
  }

  @Patch('total-plays')
  async updateTotalPlays(@Body() updateMediaDto: UpdateMediaDto): Promise<Media> {
    return await this.mediaService.updateTotalPlays(updateMediaDto);
  }

  @Get('active')
  async findActiveMediaFilter(): Promise<string[]>  {
    const medias: Media[] = await this.mediaService.findAllActiveMedia();
    return medias.map( media => media.hashed_id )
  }

  @Get()
  async findAll(): Promise<Media[]>  {
    return await this.mediaService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
