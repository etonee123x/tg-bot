import { isString } from '@shared/src/utils';

export interface CommandParamOptions {
  title: string;
  required?: boolean;
  type: 'string' | 'boolean' | 'number' | 'text';
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  default?: any;
}

export interface CommandParams {
  [title: string]: CommandParamOptions;
}

export enum COMMAND_TITLE {
  ECHO = 'echo',
  ROLL = 'roll',
  WEATHER = 'weather',
  PIXEL = 'pixel',
  ASCII = 'ascii',
  CYPHER = 'cypher',
  DECYPHER = 'decypher',
  HAPPY_NORMING = 'happy_norming',
  FUNNY_ANIMALS = 'funny_animals',
  HELP = 'help',
  AUTH = 'auth',
}

export const isCommandTitle = <T>(argument: T | COMMAND_TITLE): argument is COMMAND_TITLE =>
  isString(argument) && Object.values<string>(COMMAND_TITLE).includes(argument);
