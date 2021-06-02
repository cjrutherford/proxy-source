import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import LoginRequestDTO from './models/loginRequest.dto';
import RegisterRequestDTO from './models/registerRequest.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() {username, password, confirm}: RegisterRequestDTO): Promise<boolean> {
    return await this.appService.register(username, password, confirm);
  }

  @Post('login')
  async login(@Body() {username, password}: LoginRequestDTO): Promise<any>{
    return await this.appService.login(username, password);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('authed')
  authed(){
    return 'Authenticated';
  }
}
