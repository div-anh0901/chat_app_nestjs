import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './utils/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupModule } from './groups/group.module';
import { FriendsModule } from './friends/friends.module';
import { APP_GUARD } from '@nestjs/core';
import { FriendRequestModule } from './friend-requests/friend-requests.module';
import { EventsModule } from './event/events.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGurad } from './utils/Throttler';
import { ExistsModule } from './exists/exists.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env.development'
    }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      synchronize: true,
      entities,
      // logging: true
    }),
    ConversationsModule,
    MessagesModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
    GroupModule,
    FriendsModule,
    FriendRequestModule,
    EventsModule,
    ExistsModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGurad
    }
  ],
})
export class AppModule { }
