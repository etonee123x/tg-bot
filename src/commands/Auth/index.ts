import jwt from 'jsonwebtoken';

export default class Auth {
    private readonly jwt: string;
  constructor(){
    const SECRET_KEY = process.env.SECRET_KEY

    this.jwt=jwt.sign({role: 'Admin'}, String(SECRET_KEY), {expiresIn:'1h'});
  }
    public getResult() {
        return this.jwt
    }
}
