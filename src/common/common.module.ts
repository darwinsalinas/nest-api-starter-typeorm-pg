import { Module } from '@nestjs/common';
import { AxiosAdapter, FetchAdapter, HttpAdapter } from './adapters';

@Module({
    providers: [
        AxiosAdapter,
        FetchAdapter,
        {
            provide: HttpAdapter, useExisting: AxiosAdapter
        }
    ],
    exports: [
        HttpAdapter
    ]
})
export class CommonModule { }
