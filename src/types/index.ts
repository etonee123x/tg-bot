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

export const ERRORS_MESSAGES = {
  NO_REQUIRED_PHOTO: () => 'Attach a photo!',
  FETCHING_ERROR: () => 'An error occured during fetching data from outer server!',
};
