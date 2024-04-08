export interface IAuthCredentials {
  email: string
  password: string
}

export interface IAuthenticationUseCase {
  execute(credentials: IAuthCredentials): Promise<string>
}
