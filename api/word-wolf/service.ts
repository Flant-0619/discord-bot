import { StageInstance } from "discord.js";
import { state } from "./const";
import { Option, GameInfo, State } from "./interface";

const fs = require("fs")
const gameInfoJson: GameInfo = fs.readFileSync('../../game-info.json', 'utf8');
const stateJson: State = fs.readFileSync('../../state.json', 'utf8')

export class WordWolfCommandService {
    game(_command: string, options: Option[]) {
    const option = options[0];
    switch (option.name) {
      case "start":
        if(stateJson.state != state.waiting) {
          return
        }
        gameInfoJson.round = 0
        gameInfoJson.players = stateJson.players.map((player) => {
          return {
            name : player,
            point: 0,
            voted: 0
          }
        })

        this.writeGameInfoJson(JSON.stringify(gameInfoJson))
        this.stateUpdate(state.gameStarted);
        console.log(option);
        break;

      case "end":
        if(stateJson.state == state.awaitSetting ||
          stateJson.state == state.recruitingPlayer ||
          stateJson.state == state.waiting) {
            return
          }
        this.writeGameInfoJson("");
        this.stateUpdate(state.waiting)
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error")
    }
  }

  round(_command: string, options: Option[]) {
    const option = options[0];
    switch (option.name) {
      case "start":
        if(stateJson.state != state.wordSetting) {
            return
          }
          gameInfoJson.round += 1
          this.writeGameInfoJson(JSON.stringify(stateJson))
        console.log(option);
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error");
    }
  }

  set(_command: string, options: Option[]) {
    if(stateJson.state == state.wordSetting ||
      stateJson.state == state.waiting ||
      stateJson.state == state.recruitingPlayer ||
      stateJson.state == undefined) {
        return
      }
    options.forEach((option) => {
      const stateJson = fs.readFileSync('setting.json', 'utf8')
      switch (option.name) {
        case "timer":
          const timer = option.value;
          stateJson.timer = timer;
          this.writeStateJson(JSON.stringify(stateJson));
          break;
  
        case "round":
          const round = option.value;
          stateJson.round = round;
          this.writeStateJson(JSON.stringify(stateJson));
          break;
  
        case "mode":
          switch (option.value) {
            case "auto":
              const auto = option.value;
              stateJson.mode = auto;
              this.writeStateJson(JSON.stringify(stateJson));
              break;

            case "manual":
              const manual = option.value;
              stateJson.mode = manual;
              this.writeStateJson(JSON.stringify(stateJson));
              break;

            default:
              console.log("error");
          }
          break;
  
        case "help":
          console.log(option);
          break;
  
        default:
          console.log("error");
      }
    })
  }



  player(_command: string, options: Option[]) {
    if(!(stateJson.state == state.recruitingPlayer ||
       stateJson.state == state.roundEnded ||
        stateJson.state == state.waiting)) {
          throw new Error()
    }
    const option = options[0]
    switch (option.name) {
      case "add":
        stateJson.players.push(option.value)
        if(stateJson.players.length >= 3) {
          stateJson.state = state.waiting
        }
        this.writeStateJson(JSON.stringify(stateJson));
        
        break;

      case "remove":
        stateJson.players.map((player) => {
          if(player != option.value) {
            return player;
          }
        })
        if(stateJson.players.length <= 2) {
          stateJson.state = state.recruitingPlayer
        }
        this.writeStateJson(JSON.stringify(stateJson));
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error");
    }
  }

  vote(_command: string, options: Option[]) {
    const option = options[0];

    if(!(stateJson.state == state.roundStarted ||
      stateJson.state == state.voting)) {
      return
    }

    if(option == undefined) {
      this.stateUpdate(state.voting);
      return
    }

    if(option.name == "player") {
      gameInfoJson.players = gameInfoJson.players.map((player) => {
        if(player.name == option.value) {
          player.voted += 1;
        }
        return player;
      })
      
      this.writeGameInfoJson(JSON.stringify(gameInfoJson));
    }

    if(option.name == "help") {
      console.log(option);
    } else {
      console.log(option);
    }
  }

  word(_command: string, options: Option[]) {
    const option = options[0]
    switch (option.value) {
      case "answer":
        const answer = option.value;
        console.log(answer);
        break;

      case "human":
        if(!(stateJson.state == state.gameStarted ||
          stateJson.state == state.roundEnded)) {
            return
          }
        const human = option.value;
        gameInfoJson.word.human = human
        if(gameInfoJson.word.wolf != undefined) {
          this.stateUpdate(state.wordSetting);
        }
        break;

      case "wolf":
        if(!(stateJson.state == state.gameStarted ||
          stateJson.state == state.roundEnded)) {
            return
          }
        const wolf = option.value;
        gameInfoJson.word.wolf = wolf;
        if(gameInfoJson.word.human != undefined) {
          this.stateUpdate(state.wordSetting);
        }
        console.log(wolf);
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error")
    }
  }

  score(_command: string, options: Option[]) {
    const option = options[0];
    if(stateJson.state == state.waiting ||
      stateJson.state == state.awaitSetting ||
      stateJson.state == state.recruitingPlayer) {
        return;
      }
    if(option.name == "help") {
      console.log(option);
    } else {
      console.log(option);
    }
  }

  private writeStateJson(jsonString: string) {
    const filePath = "state.json";
    fs.writeFileSync(filePath, jsonString);
    const stateJson: State = fs.readFileSync(filePath, 'utf8');
    if(stateJson.mode != undefined &&
      stateJson.round != undefined &&
      stateJson.timer != undefined && 
      stateJson.state == state.awaitSetting) {
        this.stateUpdate(state.recruitingPlayer)
    }
  }

  private writeGameInfoJson(jsonString: string) {
    const filePath = "state.json";
    fs.writeFileSync(filePath, jsonString);
  }

  private stateUpdate(state: string) {
    const filePath = "state.json";
    const stateJson: State = fs.readFileSync(filePath, 'utf8');
    stateJson.state = state
    fs.writeFileSync(filePath, stateJson)
  }

}