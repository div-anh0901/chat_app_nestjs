import { IsNotEmpty, IsString } from "class-validator";


export class UpdateProsenceStatusDto {
    @IsNotEmpty()
    @IsString()
    statusMessage: string;

}