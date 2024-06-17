import jwt from 'jsonwebtoken';

export default class Auth {
  private readonly jwt: string;

  constructor(){
    this.jwt = jwt.sign({ role: 'Admin' }, String(process.env.SECRET_KEY), { expiresIn: '1h' });
  }

  public getResult() {
    return `<code>${this.jwt}</code>`;
  }
}
