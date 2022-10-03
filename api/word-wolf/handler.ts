import {  VercelRequest, VercelResponse } from "@vercel/node";
import { bold, InteractionResponseType } from "discord.js";
import nacl from "tweetnacl";
import { FailedRequest } from "./interface";
import type { Readable } from 'node:stream';
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(event:  VercelRequest, response: VercelResponse) {
  try{
    const validate = await checkRequest(event)
    if(!validate) {
      response.send({
        statusCode: 401,
        body: JSON.stringify('invalid request signature'),
      })
      response.end();
    }

    if(event.body.type == 1) {
      registerCommands()
      response.statusCode = 200
      response.send({
        type: InteractionResponseType.Pong,
      });
      response.end();
    }

    if (event.body.data.name == 'foo') {
      response.send(
        JSON.stringify({
          "type": 4,  // This type stands for answer with invocation shown
          "data": { "content": "bar" }
        })
      )
      response.end()
    }

  } catch(e) {
    console.error(e)
    response.end();
  }
}

async function checkRequest(event: VercelRequest): Promise<Boolean> {
  const headers = event.headers

  const buf = await buffer(event);
  const strBody = buf.toString('utf8');
  
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
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex')
  );

  return isVerified
}

async function buffer(readable: Readable) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function registerCommands() {
  const url = `https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`

  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json"
  }

  const command_data = {
    "name": "foo",
    "type": 1,
    "description": "replies with bar ;/",
  }

  axios.post(url, JSON.stringify(command_data), {
    headers: headers,
  })
}