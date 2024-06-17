import jwt from 'jsonwebtoken';
import GenericCommand from '@/commands/GenericCommand';
import { CommandParams } from '@/types';

const params: CommandParams = {
  long: {
    title: 'long',
    type: 'boolean',
    default: false,
  },
  pattern: {
    title: 'pattern',
    type: 'string',
    default: '',
  },
};
export default class Auth extends GenericCommand {
  private readonly jwt: string;
  private readonly pattern: string;

  constructor(commandBody?: string) {
    super(params, commandBody);
    const isLong = this.getValueForParam('long');
    this.pattern = this.getValueForParam('pattern')
    this.jwt = jwt.sign({ role: 'Admin' }, String(process.env.SECRET_KEY), { expiresIn: isLong ? '1d' : '1h' });
  }

  public getResult() {
    return this.pattern ? this.pattern.replace('[token]', this.jwt) : `<code>${this.jwt}</code>`;
  }
}
