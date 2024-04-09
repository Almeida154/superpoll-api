export interface IHashMaker {
  hash(value: string): Promise<string>
}
