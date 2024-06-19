export { Cypher } from '@/commands/Crypting/Cypher';
export { Decypher } from '@/commands/Crypting/Decypher';
import { initialABCString } from '@/commands/Crypting/initialABCString';

export const formAlphabet = (key: string) => {
  let alphabet = '';

  key.split('').forEach((keyChar) => {
    if (!alphabet.includes(keyChar)) {
      alphabet += keyChar;
    }
  });

  initialABCString.split('').forEach((abcChar) => {
    if (!alphabet.includes(abcChar)) {
      alphabet += abcChar;
    }
  });

  return alphabet;
};
