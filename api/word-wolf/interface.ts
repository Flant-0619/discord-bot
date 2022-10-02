export interface FailedRequest {
  cookies: string[],
  isBase64Encoded: boolean,
  statusCode: number,
  headers: {},
  body: string
}