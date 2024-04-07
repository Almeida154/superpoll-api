export interface IAuthCredentials {
  email: string
  password: string
}

export interface IAuthentication {
  auth(credentials: IAuthCredentials): Promise<string>
}
