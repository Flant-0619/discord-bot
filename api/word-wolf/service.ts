export class WordWolfCommandService {
  game(_command: string, options: string[]) {
    const option = options[0];
    switch (option) {
      case "start":
        console.log(option);
        break;

      case "end":
        console.log(option);
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error")
    }
  }

  round(_command: string, options: string[]) {
    const option = options[0];
    switch (option) {
      case "start":
        console.log(option);
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error");
    }
  }

  set(_command: string, options: string[]) {
    const option = options.shift();
    switch (option) {
      case "timer":
        const timer = options.shift();
        if(Number(timer) <= 5 && Number(timer) > 0) {
          console.log("timer");
        } else {
          console.log("error");
        }
        break;

      case "round":
        const round = options.shift();
        if(Number(round) && Number(round) != undefined) {
          console.log("round");
        } else {
          console.log("error");
        }
        break;

      case "mode":
        const mode = options.shift();
        if(mode == "auto") {
          console.log("mode set auto");
        } else if(mode == "manual") {
          console.log("mode set manual");
        } else {
          console.log("error");
        }
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error");
    }
  }



  player(_command: string, options: string[]) {
    const option = options.shift();
    switch (option) {
      case "add":
        options.forEach((player) => {
          console.log(player);
        })
        break;

      case "remove":
        options.forEach((player) => {
          console.log(player);
        })
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error");
    }
  }

  vote(_command: string, options: string[]) {
    const option = options[0];
    if(option == "help") {
      console.log(option);
    } else {
      console.log(option);
    }
  }

  word(_command: string, options: string[]) {
    const option = options.shift();
    switch (option) {
      case "answer":
        const answer = options[0];
        console.log(answer);
        break;

      case "human":
        const human = options[0];
        console.log(human);
        break;

      case "wolf":
        const wolf = options[0];
        console.log(wolf);
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error")
    }
  }

  score(_command: string, options: string[]) {
    const option = options[0];
    if(option == "help") {
      console.log(option);
    } else {
      console.log(option);
    }
  }

  library(_command: string, options: string[]) {
    const option = options.shift();
    switch (option) {
      case "word":
        const wordAttribute = options.shift();
        switch (wordAttribute) {
          case "add":
            const addHuman = options[0];
            const addWolf = option[1];
            console.log(addHuman);
            console.log(addWolf);
            break;

          case "remove":
            const removeHuman = options[0];
            const removeWolf = option[1];
            console.log(removeHuman);
            console.log(removeWolf);
            break;
        }
        break;

      case "category":
        const categoryAttribute = options.shift();
        switch (categoryAttribute) {
          case "add":
            const addCategory = options[0];
            console.log(addCategory);
            break;

          case "remove":
            const removeCategory = options[0];
            console.log(removeCategory);
            break;
        }
        break;

      case "help":
        console.log(option);
        break;

      default:
        console.log("error");
    }
  }
}