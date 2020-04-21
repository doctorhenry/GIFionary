<template>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GIFionary</title>

    <!-- Move Bulma to NPM -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.2/css/bulma.min.css" />
    <link rel="icon" href="assets/logo.ico" />
  </head>

  <body>
    <div id="app">
      <div>
        <figure class="image is-128x128">
          <img src="client/src/assets/logo.png" />
        </figure>
      </div>

      <router-view></router-view>
    </div>
  </body>
  <footer></footer>
</html>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Socket } from "socket.io-client";
import SocketEvents from "../../library/constants/socketEvents";
import Environment from "./environments/environment";
import MainMenu from "./components/MainMenu.vue";

@Component
export default class App extends Vue {
  mounted(): void {
    this.initialiseGame();
  }

  public initialiseGame(): void {
    // this.$socketIo.emit(SocketEvents.EstablishConnection);

    /*TODO:
		# Create a log in Vue and display that first
		# If user is logged in then give option to create/join game
		# Wait for all players to be ready before starting game
		# Post messages up to server to dictate who's turn it is

		<Add more here>
	*/
  }
}
</script>