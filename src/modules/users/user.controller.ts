import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, Version } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, GetAllUsersQueryDto } from "./dtos";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { Protected } from "src/decorators/protected.decorator";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "./enums";




@ApiBearerAuth()
@Controller({
  path: 'users',
  version: ["2"],
})
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({ summary: 'Barcha userlarni olish' })
  @Version(["1"])
  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async getAll(@Query() queries: GetAllUsersQueryDto) {
    return await this.service.getAll(queries);
  }

  @ApiOperation({ summary: 'User yaratish' })
  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async create(@Body() payload: CreateUserDto) {
    return await this.service.create(payload);
  }

  @ApiOperation({ summary: 'User yangilash' })
  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async update(
    @Body() payload: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.service.update(id, payload,);
  }


  @ApiOperation({ summary: "User o'chirish" })
  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
