import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { CreatePostResponseDto } from './dto/create-post-response.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { Page } from 'src/utils/page';
import { Posts } from './entities/posts.entity';

@ApiTags('게시글 API')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '게시글 등록',
    description:
      '게시글을 db에 등록한다.기본적으로 임시저장 상태이며 저장 api를 호출하면 발행된다',
  })
  @Post()
  @ApiCreatedResponse({ description: '생성 성공', type: CreatePostResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async createPost(@Req() req: Request): Promise<CreatePostResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.create({ kakaoId });
  }

  @ApiOperation({
    summary: '게시글 발행 혹은 수정',
    description: `게시글을 발행한다. 빈 값을 매핑하고 조회 가능 상태로 변경한다. 
    없으면 생성하고 있으면 update하는 로직으로 
    바로 게시글 생성에 사용해도 되고, 수정용으로 사용해도 된다.`,
  })
  @Post('publish')
  @ApiCreatedResponse({ description: '발행 성공', type: PublishPostDto })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async publishPost(
    @Req() req: Request,
    @Body() body: CreatePostInput,
  ): Promise<PublishPostDto> {
    const kakaoId = req.user.userId;
    const dto = { ...body, user: kakaoId };
    return await this.postsService.publish(dto);
  }

  @ApiOperation({
    summary: '전체 게시글 조회 API',
    description:
      'Query를 통해 페이지네이션 가능. default) pageNo: 1, pageSize: 10',
  })
  @ApiCreatedResponse({ description: '조회 성공', type: Page<Posts> })
  @HttpCode(200)
  @Get()
  async fetchPosts(@Query() post: FetchPostsDto): Promise<Page<Posts>> {
    return await this.postsService.fetchPosts(post);
  }

  @ApiOperation({
    summary: '임시작성 게시글 조회',
    description: '로그인된 유저의 임시작성 게시글을 조회한다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('temp')
  async fetchTempPosts(@Req() req: Request): Promise<Posts[]> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchTempPosts({ kakaoId });
  }
}
