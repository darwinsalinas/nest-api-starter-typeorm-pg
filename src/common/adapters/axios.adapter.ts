import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { HttpAdapter } from './http.adapter';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private readonly logger = new Logger(AxiosAdapter.name);

    async get<T = any>(url: string): Promise<T> {
        try {
            const { data } = await axios.get<T>(url);

            return data;
        } catch (error) {
            this.logger.log(error);

            throw new Error('Internal Server Error');
        }
    }
}