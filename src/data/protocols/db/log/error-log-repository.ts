export interface IErrorLogRepository {
  logError(stack: string): Promise<void>
}
