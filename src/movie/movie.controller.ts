import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { PageOptionDto } from '../common/dtos/page-options.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async createPost() {
    return await this.movieService.createMovie();
  }

  @Get('/all')
  async getAllMovies(@Query() pageOptionDto: PageOptionDto) {
    return await this.movieService.getAllMovies(pageOptionDto);
  }
}
