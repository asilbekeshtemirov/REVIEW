import { UserService } from './user.service';
import { CreateUserDto, GetAllUsersQueryDto, UpdateUserDto } from './dtos';
import { UserRoles } from './enums';
import * as bcrypt from 'bcryptjs';

describe('UserService unit test', () => {
  let service: UserService;

  const mockUser = {
    id: 1,
    name: 'Tom',
    age: 22,
    email: 'tom@example.com',
    password: bcrypt.hashSync('tom123'),
    role: UserRoles.ADMIN,
    image: 'uploads/tom.png',
  };

  const userModel = {
    findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [] }),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const fsHelper = {
    deleteFile: jest.fn(),
  };

  beforeEach(() => {
    service = new UserService(userModel as any, fsHelper as any);
    jest.clearAllMocks();
  });

  it('service defined', () => {
    expect(service).toBeDefined();
  });

  it('getAll', async () => {
    const query: GetAllUsersQueryDto = { limit: 5, page: 1 };
    const res = await service.getAll(query);
    expect(res.count).toBe(1);
    expect(res.limit).toBe(5);
    expect(res.page).toBe(1);
    expect(res.data).toEqual([]);
  });

  it('create user', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue(mockUser);

    const dto: CreateUserDto = {
      name: 'Tom',
      age: 22,
      email: 'tom@example.com',
      password: 'tom123',
      role: UserRoles.ADMIN,
    };
    try {
      await service.create
    } catch (error) {
      
    }

    const res = await service.create(dto);

    expect(res.message).toBe('Yaratildi');
    expect(res.data.name).toBe(dto.name);
    expect(res.data.email).toBe(dto.email);
    expect(res.data.age).toBe(dto.age);
    expect(res.data.role).toBe(dto.role);
  });

  // it('update user', async () => {
  //   userModel.findByPk.mockResolvedValue(mockUser);
  //   userModel.update.mockResolvedValue([1, [mockUser]]);

  //   const update: UpdateUserDto = {
  //     name: 'Updated Tom',
  //     age: 30,
  //     role: UserRoles.USER,
  //   };

  //   const res = await service.update(1, update);

  //   expect(res.message).toBe('success');
  //   expect(res.data).toBeDefined();
  // });

  it('delete user', async () => {
    userModel.findByPk.mockResolvedValue(mockUser);
    userModel.destroy.mockResolvedValue(1);
    fsHelper.deleteFile.mockResolvedValue(undefined);

    const res = await service.delete(1);

    expect(res.message).toBe("O'chirildi");
    expect(res.data).toEqual(mockUser);
    expect(fsHelper.deleteFile).toHaveBeenCalledWith(mockUser.image);
    expect(userModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('seedUsers', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue(mockUser);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await service.seedUsers();

    expect(userModel.findOne).toHaveBeenCalled();
    expect(userModel.create).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Adminlar yaratildi ✅');
  });
});
