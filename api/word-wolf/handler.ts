import {  VercelRequest, VercelResponse } from "@vercel/node";
import { InteractionResponseType } from "discord.js";
import { FailedRequest } from "./interface";

const nacl = require('tweetnacl');

export default function handler(event:  VercelRequest, response: VercelResponse) {
  console.log(event);
  const validate = checkRequest(event)
  if(validate) {
    response.statusCode = 401
    response.send({
      message: 'invalid request signature'
    })
    response.end();
  };
  response.statusCode = 200
  response.send({
    type: InteractionResponseType.Pong,
  });
  response.end();

}

function checkRequest(event: VercelRequest): Boolean {
  const headers = event.headers
  const strBody = event.body

  const PUBLIC_KEY = process.env.PUBLIC_KEY

  const signature = headers["x-signature-ed25519"].toString()
  const timestamp = headers["x-signature-timestamp"]


  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex')
  );

  
  if(!isVerified) {
    return false
  }
}