export interface IResponse<T> {
  data: T
  errCode: number
  errMessage: string
}
