import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKeyHeader =
      request.headers['x-api-key'] ||
      request.headers['X-API-KEY'] ||
      request.headers['X-Api-Key'];

    const apiKey = this.configService.get<string>('API_KEY');

    if (apiKeyHeader && apiKeyHeader === apiKey) {
      return true;
    }

    throw new UnauthorizedException('Invalid API key');
  }
}
