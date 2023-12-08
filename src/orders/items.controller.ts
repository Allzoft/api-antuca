import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './services/items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('admin')
@Controller('items')
export class ItemsController {
  constructor(private readonly statusService: ItemsService) {}

  @Post()
  create(@Body() createStatusDto: CreateItemDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateItemDto) {
    return this.statusService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.statusService.remove(+id);
    return { message: `Item with id: ${id} deleted successfully` };
  }
}
