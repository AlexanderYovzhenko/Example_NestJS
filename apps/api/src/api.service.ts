import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  async health(): Promise<boolean> {
    return true;
  }

  async checkHome(): Promise<boolean> {
    return true;
  }
}
