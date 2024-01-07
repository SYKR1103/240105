import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PageOptionDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMegaDto } from '../common/dtos/page-mega.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createMovie() {
    const { data, status } = await this.httpService
      .get(this.configService.get('TMDB_URL'), {
        headers: { Authorization: this.configService.get('TMDB_KEY') },
      })
      .toPromise();
    console.log(status);

    if (status === 200) {
      const datas = data.results;
      const movieData = [];

      datas?.map((data) =>
        movieData.push({
          title: data['title'],
          overview: data['overview'],
          release_date: data['release_date'],
          adult: data['adult'],
          vote_average: data['vote_average'],
        }),
      );
      return await this.movieRepo.save(movieData);
    }
  }

  async getAllMovies(pageOptionDto: PageOptionDto) {
    const queryBuilder = await this.movieRepo.createQueryBuilder('movie');

    await queryBuilder
      .orderBy('movie.createdAt', pageOptionDto.order)
      .skip(pageOptionDto.skip)
      .take(pageOptionDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMegaDto = new PageMegaDto({ pageOptionDto, itemCount });
    return new PageDto(entities, pageMegaDto);
  }
}
