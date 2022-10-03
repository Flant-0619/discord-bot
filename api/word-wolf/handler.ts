import {  VercelRequest, VercelResponse } from "@vercel/node";
import { InteractionResponseType } from "discord.js";
import nacl from "tweetnacl";
import { FailedRequest } from "./interface";
import type { Readable } from 'node:stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(event:  VercelRequest, response: VercelResponse) {
  try{
    console.log(event.headers)
    const validate = await checkRequest(event)
    if(!validate) {
      console.log(401)
      response.send({
        statusCode: 401,
        body: JSON.stringify('invalid request signature'),
      })
      response.end();
    } else {
    console.log(200)
    response.statusCode = 200
    response.send({
      type: InteractionResponseType.Pong,
    });
    response.end();
  }
  } catch(e) {
    console.error(e)
    response.end();
  }
}

async function checkRequest(event: VercelRequest): Promise<Boolean> {
  console.log(event.body)
  const headers = event.headers

  const buf = await buffer(event);
  const json = buf.toString('utf8');
  const strBody = JSON.stringify(json)

  console.log(strBody)
  
  const signature = headers["x-signature-ed25519"]
  const timestamp = headers["x-signature-timestamp"]
  const PUBLIC_KEY = process.env.PUBLIC_KEY

  if(!(typeof strBody === 'string')) {
    console.log(typeof strBody)
    return false
  }

  if(!(typeof signature === 'string')) {
    return false
  }

  if(!(typeof timestamp === 'string')) {
    return false
  }
  
  if(PUBLIC_KEY === undefined) {
    return false
  }

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp, strBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex')
  );

    console.log(isVerified)

  return isVerified
}

async function buffer(readable: Readable) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}