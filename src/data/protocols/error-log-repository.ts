export interface IErrorLogRepository {
  log(stack: string): Promise<void>
}
