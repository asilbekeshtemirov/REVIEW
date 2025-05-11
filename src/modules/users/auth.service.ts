import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dtos";
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models";
import { JwtHelper } from "src/helpers";


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
        private jwtHelper: JwtHelper,
    ) { }

    async login(payload: LoginDto) {
        const foundedUser = await this.userModel.findOne({
          where: { email: payload.email },
        });
      
        if (!foundedUser) {
          throw new NotFoundException('Foydalanuvchi topilmadi');
        }
      
        const isUserMatch = bcrypt.compareSync(
          payload.password,
          foundedUser.password,
        );
      
        if (!isUserMatch) {
          throw new ConflictException('Berilgan password xato');
        }
      
        const { token } = await this.jwtHelper.generateToken({
          id: foundedUser.id,
          role: foundedUser.dataValues.role,
        });
      
        return {
          message: 'Muvaffaqiyatli kirildi',
          token,
          data: foundedUser,
        };
      }

    async register(payload: RegisterDto) {
        const foundedUser = await this.userModel.findOne({
            where: { email: payload.email },
        });

        if (foundedUser) {
            throw new ConflictException("Bunday email'lik foydalanuvchi bor");
        }

        const passHash = bcrypt.hashSync(payload.password);

        const user = await this.userModel.create({
            email: payload.email,
            name: payload.name,
            age: payload.age,
            password: passHash,
        });

        return {
            message: "Ro'yhatdan o'tkazildi",
            data: user,
        };
    }
}