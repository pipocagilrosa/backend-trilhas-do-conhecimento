import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CoursesModule } from './courses/courses.module';
import { prototype } from 'events';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        prot: parseInt(process.env.SMTP_PORT, 2525),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    UsersModule,
    CoursesModule,
    AuthModule,
  ],
})
export class AppModule { }
