import {  VercelRequest, VercelResponse } from "@vercel/node";
import { FailedRequest } from "./interface";

export default function handler(event:  VercelRequest, response: VercelResponse) {
  const validate = checkRequest(event)
  if(validate) {
    response.statusCode = validate.statusCode
    response.end();
  };

  console.log(event.body);

}

function checkRequest(event: VercelRequest): FailedRequest {
  const headers = event.headers
  const body = event.body

  const signature = headers["x-signature-ed25519"]
  const timestamp = headers["x-signature-timestamp"]

  if(!signature || !timestamp || !body) {
    return {
      "cookies": [],
      "isBase64Encoded": false,
      "statusCode": 401,
      "headers": {},
      "body": ""
  }
  }
}