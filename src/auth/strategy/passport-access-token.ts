import * as passport from 'passport-strategy'
import { ExtractJwt } from 'passport-jwt'
import { FastifyRequest } from 'fastify'

export interface IStrategyOptions {
  passReqToCallback?: Function
}

export class Strategy extends passport.Strategy {
  public name = 'accessToken'
  private _verify: Function
  private _passReqToCallback?: Function

  constructor(options: IStrategyOptions, verify: Function) {
    super()

    if (!verify) {
      throw new TypeError('AccessTokenStrategy requires a verify callback')
    }

    this._verify = verify
    this._passReqToCallback = options.passReqToCallback
  }

  public authenticate(req: FastifyRequest['raw']) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    const spaceCode = req.headers['X-Space-Code'] || req.headers['x-space-code']

    if (!token) {
      // @ts-expect-error
      return this.fail(new Error('No access token'), 500)
    }

    const verified = (err: any, user: any, info: any) => {
      if (err) {
        // @ts-expect-error
        return this.error(err)
      }
      if (!user) {
        // @ts-expect-error
        return this.fail(info)
      }
      // @ts-expect-error
      this.success(user, info)
    }

    try {
      if (this._passReqToCallback) {
        this._verify(req, { token, spaceCode }, verified)
      }
      else {
        this._verify({ token, spaceCode }, verified)
      }
    }
    catch (ex) {
      // @ts-expect-error
      return this.error(ex)
    }
  }
}
