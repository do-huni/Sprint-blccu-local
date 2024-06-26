import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from './APIs/comments/comments.module';
import { PostsModule } from './APIs/posts/posts.module';
import { UsersModule } from './APIs/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './APIs/auth/auth.module';
import { NeighborsModule } from './APIs/neighbors/neighbors.module';
import { PostBackgroundsModule } from './APIs/postBackgrounds/postBackgrounds.module';
import { PostCategoriesModule } from './APIs/postCategories/PostCategories.module';
import { LikesModule } from './APIs/likes/likes.module';
import { StickersModule } from './APIs/stickers/stickers.module';
import { StickerCategoriesModule } from './APIs/stickerCategories/stickerCategories.module';
import { StickerBlocksModule } from './APIs/stickerBlocks/stickerBlocks.module';
import { NotificationsModule } from './APIs/notifications/notifications.module';
import { AnnouncementsModule } from './APIs/announcements/announcements.module';
import { ReportsModule } from './APIs/reports/reports.module';

@Module({
  imports: [
    AnnouncementsModule,
    CommentsModule,
    StickersModule,
    StickerCategoriesModule,
    StickerBlocksModule,
    PostsModule,
    LikesModule,
    UsersModule,
    AuthModule,
    NeighborsModule,
    NotificationsModule,
    PostBackgroundsModule,
    PostCategoriesModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      bigNumberStrings: false,
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/APIs/**/*.entity.*'],
      synchronize: false,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
