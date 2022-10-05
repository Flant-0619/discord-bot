import {  VercelRequest, VercelResponse } from "@vercel/node";
import { InteractionResponseType, User, userMention } from "discord.js";
import nacl from "tweetnacl";
import type { Readable } from 'node:stream';
import { WordWolfCommandService } from "./service";
import { PostCommandData, Option} from "./interface";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

const wordWolfCommandService = new WordWolfCommandService()

export default async function handler(event:  VercelRequest, response: VercelResponse) {
  try{
    const validate = await checkRequest(event)
    if(!validate) {
      console.log(401)
      response.send({
        statusCode: 401,
        body: JSON.stringify('invalid request signature'),
      })
      response.end();
      return;
    }

    if(event.body.type == 1) {
      console.log(200)
      response.statusCode = 200
      response.send({
        type: InteractionResponseType.Pong,
      });
      response.end();
    }

    console.log(event.body.data.name)
    console.log(event.body.data.options)

    const command = event.body.data.name
    const options: Option[] = event.body.data.options

    switch(command) {
      case 'game':
        wordWolfCommandService.game(command, options);
        response.send({
          type: 4,  // This type stands for answer with invocation shown
          data: { "content": "bar" }
          }
        )
        
        break;

      case 'round':
        const url = "https://discord.com/api/v8/applications/users/@me/channels"
        // wordWolfCommandService.round(command, options);
        console.log(url)
        const headers = {
          "Authorization": `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json"
        }
        const body = {
          "recipient_id": "329907692837535746"
        }
        await axios.post(url, JSON.stringify(body), {
          headers: headers,
          })

          response.send({
            type: 4,  // This type stands for answer with invocation shown
            data: { "content": "createDM" }
            }
          )
          response.end()
          return

        break;

      case 'set':
        wordWolfCommandService.set(command, options);
        break;

      case 'player':
        wordWolfCommandService.player(command, options);
        break;

      case 'vote':
        wordWolfCommandService.word(command, options);
        break;

      case 'word':
        wordWolfCommandService.word(command, options);
        break;

      case 'score':
        wordWolfCommandService.score(command, options);
        break;
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