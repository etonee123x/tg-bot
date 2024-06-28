import jwt from 'jsonwebtoken';
import { ParameterBoolean, ParameterString } from '@/helpers/Parameter';

export class Auth {
  private readonly jwt;
  private readonly pattern;

  constructor(commandBody: string) {
    this.pattern = new ParameterString('pattern').getValue(commandBody, process.env.PATTERN ?? '');

    this.jwt = jwt.sign({ role: 'Admin' }, String(process.env.SECRET_KEY), {
      expiresIn: new ParameterBoolean('long').getValue(commandBody) ? '1d' : '1h',
    });
  }

  public getResult() {
    return this.pattern ? this.pattern.replace('[token]', this.jwt) : `<code>${this.jwt}</code>`;
  }
}
