export interface IAuthentication {
  execute(email: string, password: string): Promise<string>
}
