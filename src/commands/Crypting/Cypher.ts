import GenericCommand from '@commands/GenericCommand';
import { formAlphabet } from '@commands/Crypting';

import keys from '@commands/Crypting/keys';
import initialABCString from '@commands/Crypting/initialABCString';

import type { CommandParams } from '@/types';

const params: CommandParams = {
  phrase: {
    title: 'phrase',
    type: 'text',
    default: 'congrats with decyphering it!',
  },
  key: {
    title: 'key',
    type: 'string',
    default: undefined,
  },
};

export default class Cypher extends GenericCommand {
  private readonly phrase: string;
  protected readonly key: string;

  constructor(commandBody?: string) {
    super(params, commandBody);
    this.phrase = this.getValueForParam('phrase').toLowerCase();
    this.key = this.getValueForParam('key')?.toLowerCase() ?? keys[Math.floor(keys.length * Math.random())];
  }

  public getResult() {
    const tripleBackticks = '```';
    const alphabet = formAlphabet(this.key);

    return (
      this.phrase
        .split('')
        .reduce(
          (acc, char, i) =>
            (acc += initialABCString.includes(char)
              ? alphabet[(initialABCString.indexOf(char) + i) % initialABCString.length]
              : char),
          `${tripleBackticks}\n'`,
        ) + `'\n${tripleBackticks}\ncyphered with ${tripleBackticks} --key ${this.key}${tripleBackticks}`
    );
  }
}
