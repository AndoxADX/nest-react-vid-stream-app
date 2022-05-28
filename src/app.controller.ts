import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
  // @Get()
  // @Render('list')
  // getList(@Req() request: Request,@Res() response: Response) : any{
  //   return this.appService.getList(request, response);
  // }
  // root() {
  //   return {
  //     files : any
  //    };
  // }
  // @Get()
  // @Render('index.hbs')
  // root() {
  //   return { message: 'Hello world!' };
  // }
}
