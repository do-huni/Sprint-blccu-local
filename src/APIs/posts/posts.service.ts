import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Page } from '../../utils/page';
import { FETCH_POST_OPTION, FetchPostsDto } from './dto/fetch-posts.dto';
import { CreatePostResponseDto } from './dto/create-post-response.dto';
import { PublishPostDto } from './dto/publish-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}
  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  async imageUpload(file: Express.Multer.File) {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }

  async create({ kakaoId }): Promise<CreatePostResponseDto> {
    return await this.postsRepository.save({ user: kakaoId });
  }

  async publish({
    id,
    user,
    postCategory,
    postBackground,
    allow_comment,
    scope,
    title,
  }: CreatePostDto): Promise<PublishPostDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const post = await this.postsRepository.findOne({
        where: {
          id,
        },
      });
      const updatedPost = await this.postsRepository.save({
        ...post,
        title,
        allow_comment,
        scope,
        postBackground: { id: postBackground },
        postCategory: { id: postCategory },
        user: { kakaoId: user },
        isPublished: true,
      });
      await queryRunner.commitTransaction();
      return updatedPost;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async fetchPosts(page: FetchPostsDto): Promise<Page<Posts>> {
    const total = await this.postsRepository.count({
      where: { isPublished: true },
    });
    const posts = await this.postsRepository.find({
      select: FETCH_POST_OPTION,
      relations: { user: true, postBackground: true, postCategory: true },
      where: { isPublished: true },
      order: { id: 'DESC' },
      take: page.getLimit(),
      skip: page.getOffset(),
    });
    return new Page<Posts>(total, page.pageSize, posts);
  }

  async fetchTempPosts({ kakaoId }): Promise<Posts[]> {
    return await this.postsRepository.find({
      select: FETCH_POST_OPTION,
      relations: { user: true, postBackground: true, postCategory: true },
      where: { user: { kakaoId }, isPublished: false },
    });
  }
}
