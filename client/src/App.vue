<template>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GIFionary</title>

    <!-- Move Bulma to NPM -->
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.2/css/bulma.min.css" /> -->
    <!-- <link rel="stylesheet" href="../src/assets/custom.css" /> -->
    <link rel="icon" href="../src/assets/logo.ico" />
  </head>

  <body :style="{'background-image': `url(${require('./sass/layout/Gifionary-Background.png')})`}">
    <div id="app" class="is-fullheight hero">
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