<template>
<div id="app">
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>GIFionary</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.2/css/bulma.min.css" />
      <link rel="icon" href="images/logo.ico" />
    </head>

    <body>
      <div>
        <figure class="image is-128x128">
          <img src="images/logo.png" />
        </figure>
      </div>
      <div id="game" class="container has-background-primary">
        <!-- Player 1 area -->
        <div class="card has-background-primary">
          <h1 class="title is-1 has-text-centered">Player 1</h1>
          <!-- CSS formatting for the gif cards -->
          <div class="level">
            <!-- For each gif in the VueJS list produce a card -->
            <button
              v-for="(card,index) in player1"
              class="card"
              :id="card.name"
              v-on:click="playCard(card.name,card.url,index,'player1')"
              :disabled="player1Turn"
              :key="card"
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
        <!-- Story area -->
        <div class="card has-background-dark">
          <h1 class="title is-1 has-text-centered">Story</h1>
          <!-- CSS formatting for the gif cards -->
          <div class="level">
            <!-- For each gif in the VueJS list produce a card -->
            <div v-for="card in story" class="card" :id="card.name" :key="card">
              <div class="card-image">
                <figure class="image is-16by16">
                  <img :src="card.url" alt="Gif Image" />
                </figure>
              </div>
            </div>
          </div>
        </div>

        <!-- Player 2 area -->
        <div class="card has-background-success">
          <h1 class="title is-1 has-text-centered">Player 2</h1>
          <!-- CSS formatting for the gif cards -->
          <div class="level">
            <!-- For each gif in the VueJS list produce a card -->
            <button
              v-for="(card,index) in player2"
              class="card"
              :id="card.name"
              v-on:click="playCard(card.name,card.url,index,'player2')"
              :disabled="player2Turn"
              :key="card"
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
      </div>
    </body>
    <footer></footer>
  </html>
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import io from "socket.io-client";
import SocketEvents from "../../library/constants/socketEvents";
import Environment from "./environments/environment";
//Attaching bootstrap js

@Component({
  components: {}
})
export default class App extends Vue {
   mounted(){
     this.socketClient();
   }
   public socketClient(): void {
    const socketIo = io(Environment.WebSocketUrl);

    // server side code
    socketIo.on("client-message", (data: any) => {
      console.log(data);
    });

    socketIo.emit("client-message", "hello world");

    /*TODO:
		# Extract logic for game into a separate Vue (logic below)
		# Create a log in Vue and display that first
		# If user is logged in then give option to create/join game
		# Wait for all players to be ready before starting game
		# Post messages up to server to dictate who's turn it is

		<Add more here>
	*/
  }

  public player1 = [
    {
      name: "laugh",
      url:
        "https://media1.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif?itemid=9271317"
    },
    {
      name: "cry",
      url:
        "https://media.tenor.com/images/b958d257f5b1cca2838bb6011e7018c3/tenor.gif"
    },
    {
      name: "thank-you",
      url:
        "https://media1.tenor.com/images/1114067881329bb4218880eeb7ec34fd/tenor.gif?itemid=12985913"
    },
    {
      name: "really",
      url:
        "https://media.tenor.com/images/e3544b8117d3ecbb0cb8751f1ce0ff71/tenor.gif"
    },
    {
      name: "wow",
      url:
        "https://media.tenor.com/images/86eb7c00905ba5fa58b0e0bc7c7c7486/tenor.gif"
    }
  ];
  public player2 = [
    {
      name: "laugh",
      url:
        "https://media1.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif?itemid=9271317"
    },
    {
      name: "cry",
      url:
        "https://media.tenor.com/images/b958d257f5b1cca2838bb6011e7018c3/tenor.gif"
    },
    {
      name: "thank-you",
      url:
        "https://media1.tenor.com/images/1114067881329bb4218880eeb7ec34fd/tenor.gif?itemid=12985913"
    },
    {
      name: "really",
      url:
        "https://media.tenor.com/images/e3544b8117d3ecbb0cb8751f1ce0ff71/tenor.gif"
    },
    {
      name: "wow",
      url:
        "https://media.tenor.com/images/86eb7c00905ba5fa58b0e0bc7c7c7486/tenor.gif"
    }
  ];
  public judge = [];
  public story: object[] = [];
  public player1Turn = false;
  public player2Turn = true;

  public updated() {
    if (this.story.length == 4) {
      // Reset the gif arrays
      this.player1 = [];
      this.player2 = [];

      // alert("Game Over!");
    }
  }

  loadGifs() {
    // TODO: Load required gifs from APIs
    console.log("hey");
  }

  playCard(
    cardName: string,
    cardURL: string,
    index: number,
    thisPlayer: string
  ) {
    const playedCard = { name: cardName, url: cardURL };
    this.story.push(playedCard);

    if (thisPlayer == "player1") {
      // Remove played card from their list
      this.player1.splice(index, 1);

      // TODO: Disable player input until the next player has played their turn
      this.player1Turn = true;
      this.player2Turn = false;
    } else {
      // Remove played card from their list
      this.player2.splice(index, 1);

      // TODO: Disable player input until the next player has played their turn
      this.player1Turn = false;
      this.player2Turn = true;
    }
  }
}

// Socket.io

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
