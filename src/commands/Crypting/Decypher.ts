import GenericCommand from '@commands/GenericCommand';
import { formAlphabet } from '@commands/Crypting';

import initialABCString from '@commands/Crypting/initialABCString';

import type { CommandParams } from '@/types';

const params: CommandParams = {
  phrase: {
    title: 'phrase',
    type: 'text',
    required: true,
  },
  key: {
    title: 'key',
    type: 'string',
    required: true,
  },
};

export default class Decypher extends GenericCommand {
  private readonly phrase: string;
  protected readonly key: string;

  constructor (commandBody?: string) {
    super(params, commandBody);
    this.phrase = this.getValueForParam('phrase').toLowerCase();
    this.key = this.getValueForParam('key').toLowerCase();
  }

  public getResult () {
    const tripleBackticks = '```';
    const alphabet = formAlphabet(this.key);
    return this.phrase.split('').reduce(
      (acc, char, i) => {
        const index = (alphabet.indexOf(this.phrase[i]) - (i % initialABCString.length) + initialABCString.length)
          % initialABCString.length;
        acc += initialABCString.includes(char)
          ? alphabet[index]
          : char;
        return acc;
      },
      `the cyphered text was: ${tripleBackticks}`,
    ) + `${tripleBackticks}`;
  }
}
