import type { CommandParams } from '@/types';
import { Crypting } from './Crypting';

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

export class Cypher extends Crypting {
  constructor(commandBody?: string) {
    super({
      parametersGenericCommand: [params, commandBody],
      fallback: Crypting.KEYS[Math.floor(Crypting.KEYS.length * Math.random())],
    });
  }

  public getResult() {
    const TRIPLE_BACKTICKS = '```';

    return (
      this.phrase.split('').reduce((acc, char) => {
        const index = this.alphabet.indexOf(char) % this.alphabet.length;

        return (acc += Crypting.INITIAL_ABC_STRING.includes(char) ? Crypting.INITIAL_ABC_STRING[index] : char);
      }, `${TRIPLE_BACKTICKS}\n'`) +
      `'\n${TRIPLE_BACKTICKS}\ncyphered with ${TRIPLE_BACKTICKS} --key ${this.key}${TRIPLE_BACKTICKS}`
    );
  }
}
