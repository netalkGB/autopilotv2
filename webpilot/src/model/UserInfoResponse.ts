export interface UserInfoResponse {
  // eslint-disable-next-line camelcase
  user_id?: string
  sub?: string
  // eslint-disable-next-line camelcase
  preferred_username?: string
  name?: string
  email?: string
  // eslint-disable-next-line camelcase
  email_verified?: boolean
  created?: Date
}
