import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

const logger = new Logger('Exception Handler');

const COLUMN_VALUE_ALREADY_EXISTS = '23505';

export const handleError = (error: any) => {
    if (error.code === COLUMN_VALUE_ALREADY_EXISTS) {
        throw new BadRequestException(error.detail);
    }

    logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
}