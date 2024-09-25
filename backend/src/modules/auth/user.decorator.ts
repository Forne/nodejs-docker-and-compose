import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthPayloadDto } from './dto/user-auth-payload-dto';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserAuthPayloadDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
