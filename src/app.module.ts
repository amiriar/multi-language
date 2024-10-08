import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module/admin/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { BlogsModule } from './module/blogs/blogs.module';
import { AuthGuard } from './common/guard/auth.guard';
import { DashboardModule } from './module/dashboard/dashboard.module';
import { CatrgoriesModule } from './module/admin/catrgories/catrgories.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    UsersModule,
    BlogsModule,
    AuthModule,
    DashboardModule,
    CatrgoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
