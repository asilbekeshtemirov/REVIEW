import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({required:true,example:'Iphone 16 pro max'})
    @IsString()
    name:string;

    @ApiProperty({required:true,example:1200})
    @Type(()=>Number)
    @IsPositive()
    price:number;

    @ApiProperty({required:true,example:7})
    @Type(()=>Number)
    @IsPositive()
    count:number;
}