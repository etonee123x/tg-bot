export interface CommandParams {
  [title: string]: CommandParamOptions;
}

export interface CommandParamOptions {
  title: string;
  required?: boolean;
  type: 'string' | 'boolean' | 'number' | 'text';
  default?: any;
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
  PARSE = 'parse',
  AUTH = 'auth',
}

export const ERRORS_MESSAGES = {
  NO_PARSER_OPTIONS: () => 'Add parser options!',
  NO_REQUIRED_PHOTO: () => 'Attach a photo!',
  TOO_LARGE_FILE: () => 'This file is too large, TG bots dont work with files larger than 20MB!',
  FETCHING_ERROR: () => 'An error occured during fetching data from outer server!'
}