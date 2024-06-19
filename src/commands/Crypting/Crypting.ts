import { GenericCommand } from '@/commands/GenericCommand';

export class Crypting extends GenericCommand {
  protected static readonly KEYS = [
    'blow',
    'tin',
    'experience',
    'playground',
    'tickle',
    'frail',
    'rock',
    'point',
    'move',
    'guiltless',
    'jumpy',
    'button',
    'songs',
    'duck',
    'sort',
    'keen',
    'stick',
    'temper',
    'picture',
    'luxuriant',
  ] as const;
  protected static readonly INITIAL_ABC_STRING = 'йцукенгшщзхъфывапролджэячсмитьбюqwertyuiopasdfghjklzxcvbnm1029384756';
  protected readonly key: string;
  protected readonly alphabet: string;
  protected readonly phrase: string;

  constructor({
    parametersGenericCommand,
    fallback,
  }: {
    parametersGenericCommand: ConstructorParameters<typeof GenericCommand>;
    fallback?: string;
  }) {
    super(...parametersGenericCommand);

    this.key = this.getValueForParam('key')?.toLowerCase() ?? fallback;

    this.phrase = this.getValueForParam('phrase').toLowerCase();

    this.alphabet = [this.key, Crypting.INITIAL_ABC_STRING]
      .join('')
      .split('')
      .reduce((acc, char) => {
        if (!acc.includes(char)) {
          acc += char;
        }

        return acc;
      });
  }
}
