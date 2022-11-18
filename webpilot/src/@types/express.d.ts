export declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      // ミドルウェアで使用
      token: {
        accessToken: string
        userId: string
        clientId: string
        scope: string[]
        refreshToken: string
        expireInS: number
        created: Date
      }
    }
  }
}
