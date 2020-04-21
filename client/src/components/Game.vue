<style>
.deg0 {
  transform: translate(12em);
}

.deg45 {
  transform: rotate(45deg) translate(12em) rotate(-45deg);
}

.deg135 {
  transform: rotate(135deg) translate(12em) rotate(-135deg);
}

.deg180 {
  transform: translate(-12em);
}

.deg225 {
  transform: rotate(225deg) translate(12em) rotate(-225deg);
}

.deg315 {
  transform: rotate(315deg) translate(12em) rotate(-315deg);
}

.user-position {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4em;
  height: 4em;
  margin: -2em;
}
</style>
<template>
  <!--<div id="game" class="container has-background-primary">
    <h1>{{gameGuid}}</h1>

    <div class="card has-background-primary">
      <h1 class="title is-1 has-text-centered">Player 1</h1>

      <div class="level">

        <button
          v-for="(card,index) in player1"
          class="card"
          :id="card.name"
          v-on:click="playCard(card.name,card.url,index,'player1')"
          :disabled="player1Turn"
          :key="card.name"
        >
          <div class="card-image">
            <figure class="image is-16by16">
              <img :src="card.url" alt="Gif Image" />
            </figure>
          </div>
          <div class="card-content">
            <div class="title is-4 has-text-centered">{{card.name}}</div>
          </div>
        </button>
      </div>
    </div>

    <div class="card has-background-dark">
      <h1 class="title is-1 has-text-centered">Story</h1>

      <div class="level">

        <div v-for="setCard in story" class="card" :id="setCard.name" :key="setCard.name">
          <div class="card-image">
            <figure class="image is-16by16">
              <img :src="setCard.url" alt="Gif Image" />
            </figure>
          </div>
        </div>
      </div>
    </div>

    <div class="card has-background-success">
      <h1 class="title is-1 has-text-centered">Player 2</h1>

      <div class="level">

        <button
          v-for="(p2Card,index) in player2"
          class="card"
          :id="p2Card.name"
          v-on:click="playCard(p2Card.name,card.url,index,'player2')"
          :disabled="player2Turn"
          :key="p2Card.name"
        >
          <div class="card-image">
            <figure class="image is-16by16">
              <img :src="p2Card.url" alt="Gif Image" />
            </figure>
          </div>
          <div class="card-content">
            <div class="title is-4 has-text-centered">{{p2Card.name}}</div>
          </div>
        </button>
      </div>
    </div>
  </div>-->

  <div id="game">  
    <div class="container">
        Hello?
      <div
        style="border-radius: 48%;
    height: 520px; position: relative;"
        class="has-background-primary"
      >
      <div v-for="blah in User.testlist">
        {{blah}}
      </div>
      <div>
        {{ThisPlayer}}
      </div>
        <!-- Players -->
        <div
          v-for="(user, index) in allUsers"
          :key="user.Username"
          v-bind:class="getClass(index)"
          class="user-position"
        >
          <div style="width:50px; height:50px; background-color: red;"></div>
        </div>
      </div>
    </div>

    <div
      v-if="waitingForUsers"
      style="height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: .8;
    background-color: #fff;"
    >
      <div style="position: relative; height: 100%; width: 100%;">
        <div
          style="width: 75%;
    text-align: center;
    left: 50%;
    transform: translate(-50%);
    top: 50%;
    position: absolute;
    font-size: 20px;"
        >Waiting for other players...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SocketEvents from "../../../library/constants/socketEvents";
import UserGame from "../../../library/models/userGame";
import User from "../../../library/models/user";

@Component
export default class Game extends Vue {
  public gameReady = false;
  public waitingForUsers = true;

  // public allUsers: User[] = [
  //     new User(),
  //     new User(),
  //     new User(),
  // ];


  getClass(index: number): string {
    if (index === 0) {
      return "deg0";
    } else if (index === 1) {
      return "deg45";
    } else if (index === 2) {
      return "deg135";
    } else {
      return "deg180";
    }
  }

  mounted(): void {
    // Call game ready method here
    this.$socketIo.emit(SocketEvents.UserReady);

    this.$socketIo.on(SocketEvents.GameReady, (game: UserGame) => {
      if (game && game.ThisPlayer) {
        this.gameReady = true;
        this.waitingForUsers = game.ThisPlayer.CanPlay;
      }
    });

    this.$socketIo.on(SocketEvents.UserTurn, (result: string) => {
      this.waitingForUsers = false;
    });

    // Sends back room id
    // All players locked by default
    // Server sends message to Decider to tell them to pick from a bunch of GIFs
    // Decider picks a gif and sends it back to server and it is placed on board
    // Decider gets locked out whilst player 1 and 2 make a decision on their giphs They get given 7. They can select up to 3.
    // When players confirm selection, it sends message back to server
    // Decider then gets control
    // All players get to see the story combinations

    // Decider picks winner of round
  }

  // public player1 = [
  //   {
  //     name: "laugh",
  //     url:
  //       "https://media1.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif?itemid=9271317"
  //   },
  //   {
  //     name: "cry",
  //     url:
  //       "https://media.tenor.com/images/b958d257f5b1cca2838bb6011e7018c3/tenor.gif"
  //   },
  //   {
  //     name: "thank-you",
  //     url:
  //       "https://media1.tenor.com/images/1114067881329bb4218880eeb7ec34fd/tenor.gif?itemid=12985913"
  //   },
  //   {
  //     name: "really",
  //     url:
  //       "https://media.tenor.com/images/e3544b8117d3ecbb0cb8751f1ce0ff71/tenor.gif"
  //   },
  //   {
  //     name: "wow",
  //     url:
  //       "https://media.tenor.com/images/86eb7c00905ba5fa58b0e0bc7c7c7486/tenor.gif"
  //   }
  // ];
  // public player2 = [
  //   {
  //     name: "laugh",
  //     url:
  //       "https://media1.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif?itemid=9271317"
  //   },
  //   {
  //     name: "cry",
  //     url:
  //       "https://media.tenor.com/images/b958d257f5b1cca2838bb6011e7018c3/tenor.gif"
  //   },
  //   {
  //     name: "thank-you",
  //     url:
  //       "https://media1.tenor.com/images/1114067881329bb4218880eeb7ec34fd/tenor.gif?itemid=12985913"
  //   },
  //   {
  //     name: "really",
  //     url:
  //       "https://media.tenor.com/images/e3544b8117d3ecbb0cb8751f1ce0ff71/tenor.gif"
  //   },
  //   {
  //     name: "wow",
  //     url:
  //       "https://media.tenor.com/images/86eb7c00905ba5fa58b0e0bc7c7c7486/tenor.gif"
  //   }
  // ];
  // public judge = [];
  // public story: object[] = [];
  // public player1Turn = false;
  // public player2Turn = true;
  // public gameGuid = "";

  // public updated() {
  //   if (this.story.length == 4) {
  //     // Reset the gif arrays
  //     this.player1 = [];
  //     this.player2 = [];

  //     // alert("Game Over!");
  //   }
  // }

  // loadGifs() {
  //   // TODO: Load required gifs from APIs
  //   console.log("hey");
  // }

  // playCard(
  //   cardName: string,
  //   cardURL: string,
  //   index: number,
  //   thisPlayer: string
  // ) {
  //   const playedCard = { name: cardName, url: cardURL };
  //   this.story.push(playedCard);

  //   if (thisPlayer == "player1") {
  //     // Remove played card from their list
  //     this.player1.splice(index, 1);

  //     // TODO: Disable player input until the next player has played their turn
  //     this.player1Turn = true;
  //     this.player2Turn = false;
  //   } else {
  //     // Remove played card from their list
  //     this.player2.splice(index, 1);

  //     // TODO: Disable player input until the next player has played their turn
  //     this.player1Turn = false;
  //     this.player2Turn = true;
  //   }
  // }
}
</script>