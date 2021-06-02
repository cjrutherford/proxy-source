import {ApiProperty} from '@nestjs/swagger'
export default class RegisterRequestDTO{
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    confirm: string
}