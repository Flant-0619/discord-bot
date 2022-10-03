import {  VercelRequest, VercelResponse } from "@vercel/node";
import { InteractionResponseType } from "discord.js";
import nacl from "tweetnacl";
import type { Readable } from 'node:stream';
import axios, { AxiosStatic } from "axios";
import { WordWolfCommandService } from "./service";
import { PostCommandData } from "./interface";

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
      response.send({
        statusCode: 401,
        body: JSON.stringify('invalid request signature'),
      })
      response.end();
    }

    if(event.body.type == 1) {
      await registerCommands()
      response.statusCode = 200
      response.send({
        type: InteractionResponseType.Pong,
      });
      response.end();
    }

    if (event.body.data.name == 'foo') {
      response.send({
        type: 4,  // This type stands for answer with invocation shown
        data: { "content": "bar" }
        }
      )
      response.end()
    }

    const fullCommand = String(event.body.data.name).split(":")
    const command = fullCommand.shift()

    switch(command) {
      case 'game':
        wordWolfCommandService.game(command, fullCommand);
        break;

      case 'round':
        wordWolfCommandService.round(command, fullCommand);
        break;

      case 'set':
        wordWolfCommandService.set(command, fullCommand);
        break;

      case 'player':
        wordWolfCommandService.player(command, fullCommand);
        break;

      case 'vote':
        wordWolfCommandService.word(command, fullCommand);
        break;

      case 'word':
        wordWolfCommandService.word(command, fullCommand);
        break;

      case 'score':
        wordWolfCommandService.score(command, fullCommand);
        break;

      case 'library':
        wordWolfCommandService.library(command, fullCommand);
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

async function registerCommands() {

// if(!process.env.APPLICATION_ID) {
//   return
// }

// if(!process.env.GUILD_ID) {
//   return
// }

  const url = `https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`

  console.log(url)

  const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json"
  }

  const commands: PostCommandData[] = [
    {
      "name": "game:start",
      "type": 1,
      "description": "game start command;/",
    },
    {
      "name": "game:end",
      "type": 1,
      "description": "game end command;/",
    },
    {
      "name": "round:start",
      "type": 1,
      "description": "round start command;/",
    },
    {
      "name": "set:timer",
      "type": 1,
      "description": "timer set command;/",
    },
    {
      "name": "set:round",
      "type": 1,
      "description": "round set command;/",
    },
    {
      "name": "set:mode",
      "type": 1,
      "description": "mode set command;/",
    },
    {
      "name": "player:add",
      "type": 1,
      "description": "player add command;/",
    },
    {
      "name": "player:remove",
      "type": 1,
      "description": "player ramove command;/",
    },
    {
      "name": "vote",
      "type": 1,
      "description": "vote command;/",
    },
    {
      "name": "word:anser",
      "type": 1,
      "description": "anser declared command;/",
    },
    {
      "name": "word:human",
      "type": 1,
      "description": "human word set command;/",
    },
    {
      "name": "word:wolf",
      "type": 1,
      "description": "wolf word set command;/",
    },
    {
      "name": "score",
      "type": 1,
      "description": "score display;/",
    },
    {
      "name": "library:word:add",
      "type": 1,
      "description": "library add word;/",
    },
    {
      "name": "library:word:remove",
      "type": 1,
      "description": "library remove word;/",
    },
    {
      "name": "library:category:add",
      "type": 1,
      "description": "library add category;/",
    },
    {
      "name": "library:category:remove",
      "type": 1,
      "description": "library remove category;/",
    },
  ]

  const work: Promise<AxiosStatic>[] = []

  commands.forEach((command) => {
    work.push(
      axios.post(url, JSON.stringify(command), {
      headers: headers,
      })
    )
  })

  await Promise.all(work)
}