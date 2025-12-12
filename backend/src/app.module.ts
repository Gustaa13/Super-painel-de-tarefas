import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [PrismaModule, UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
