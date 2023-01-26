import { Injectable, Logger } from '@nestjs/common';
import { HttpAdapter } from './http.adapter';

@Injectable()
export class FetchAdapter implements HttpAdapter {
    private readonly logger = new Logger(FetchAdapter.name);

    async get<T = any>(url: string): Promise<T> {
        try {
            const response = await fetch(url);

            const data = await response.json();

            return data;
        } catch (error) {
            this.logger.log(error);

            throw new Error('Internal Server Error');
        }
    }
}