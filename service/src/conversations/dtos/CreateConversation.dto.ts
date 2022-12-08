import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateConversationDto {

    @IsString()
    @IsNotEmpty()
    username: string;


    @IsNotEmpty()
    @IsString()
    message: string;

}