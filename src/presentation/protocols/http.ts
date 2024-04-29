/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IHttpResponse {
  statusCode: number
  body: any
}

export interface IHttpRequest {
  body?: any
  headers?: any
}
