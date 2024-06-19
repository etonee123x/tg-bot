import type { CommandParams } from '@/types';
import { Crypting } from './Crypting';

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

export class Decypher extends Crypting {
  constructor(commandBody?: string) {
    super({ parametersGenericCommand: [params, commandBody] });
  }

  public getResult() {
    const TRIPLE_BACKTICKS = '```';

    return (
      this.phrase.split('').reduce((acc, char) => {
        const index = Crypting.INITIAL_ABC_STRING.indexOf(char) % Crypting.INITIAL_ABC_STRING.length;

        acc += this.alphabet.includes(char) ? this.alphabet[index] : char;

        return acc;
      }, `the cyphered text was: ${TRIPLE_BACKTICKS}\n`) + `\n${TRIPLE_BACKTICKS}`
    );
  }
}
