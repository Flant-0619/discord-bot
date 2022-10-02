import {  VercelRequest, VercelResponse } from "@vercel/node";
import { InteractionResponseType } from "discord.js";
import { FailedRequest } from "./interface";

export default function handler(event:  VercelRequest, response: VercelResponse) {
  console.log(event.body);
  const validate = checkRequest(event)
  if(validate) {
    response.statusCode = validate.statusCode
    response.end();
  };
  response.statusCode = 200
  response.send({
    type: InteractionResponseType.Pong,
  });
  response.end();

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