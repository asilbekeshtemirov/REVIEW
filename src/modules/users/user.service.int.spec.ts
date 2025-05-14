import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { FsHelper } from '../../helpers';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model';
import { CreateUserDto } from './dtos'; 
import { UserRoles } from './enums';

describe('UserService - Integration', () => {
  let service: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.DB_HOST,
          port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          logging: false,
          sync: { alter: true },
          autoLoadModels: true,
        }),
        SequelizeModule.forFeature([User]),
      ],
      providers: [UserService, FsHelper],
    }).compile();

    service = moduleFixture.get<UserService>(UserService);
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await User.sequelize?.close();
  });

  it('Get all users (INTEGRATION)', async () => {
    const data: CreateUserDto = {
      age: 19,
      email: 'ali@gmail.com',
      name: 'Ali',
      password: 'ali123',
      role: UserRoles.USER,
    };

    await service.create(data);

    const res = await service.getAll({});

    expect(res.count).toEqual(1);
    expect(res.data).toHaveLength(1);
    expect(res.data[0]).toHaveProperty('id');
  });
});
