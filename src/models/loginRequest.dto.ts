import {ApiProperty} from '@nestjs/swagger'
export default class LoginRequestDTO{
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}