import { isNil, isRealObject } from '../../utils';

export interface CustomError {
  data: unknown;
  statusCode: number;
  __isCustomError: true;
}

const CUSTOM_ERROR_UNKNOWN_STATUS_CODE = -1;

export const createError = ({ data, statusCode }: Partial<Omit<CustomError, '__isCustomError'>>) => ({
  data,
  statusCode: isNil(statusCode) ? CUSTOM_ERROR_UNKNOWN_STATUS_CODE : statusCode,
  __isCustomError: true,
});

export const createErrorClient = (data: CustomError['data']) =>
  createError({
    data,
    statusCode: 400,
  });

export const createErrorServer = (data: CustomError['data']) =>
  createError({
    data,
    statusCode: 500,
  });

export const isCustomError = (arg: unknown): arg is CustomError => isRealObject(arg) && arg.__isCustomError === true;

export const isCustomErrorClient = (arg: CustomError) => arg.statusCode >= 400 && arg.statusCode < 500;
export const isCustomErrorServer = (arg: CustomError) => arg.statusCode >= 500 && arg.statusCode < 600;
export const isCustomErrorUnknown = (arg: CustomError) => arg.statusCode === CUSTOM_ERROR_UNKNOWN_STATUS_CODE;
