import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as qs from 'querystring';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendSMS(phone: string, code: string): Promise<void> {
    const url = 'http://rest.payamak-panel.com/api/SendSMS/SendSMS';
    const newPhone = '98' + phone.substring(1);

    const body = qs.stringify({
      username: process.env.SMS_USER,
      password: process.env.SMS_PASS,
      from: process.env.SMS_NUMBER,
      to: newPhone,
      text: `سامانه صدرا \n
      خوش آمدید \n
      code: ${code}`,
      isflash: 'false',
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
