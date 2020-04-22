<template>
  <div>
    <div>
      <label for="username">Username:</label>
      <input type="Text" v-model="user.Username" name="username" />
    </div>

    <div>
      <button v-on:click="createGame()">Create Game</button>
      <button v-on:click="joinGame()">Join Game</button>
    </div>

    <div v-show="errorJoiningGame">
      <span style="color: red; font-size: 18px;">An error has occurred</span>
    </div>

    <div v-show="(loadingGame && !errorJoiningGame)">
      <span style="color: green; font-size: 18px;">Waiting for more players to join...</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Routes from "../../../library/constants/routes";
import SocketEvents from "../../../library/constants/socketEvents";
import Environment from "../environments/environment";
import User from "../../../library/models/user";
import Router from "vue-router";

@Component
export default class MainMenu extends Vue {
  public user: User;
  public errorJoiningGame: boolean = false;
  public loadingGame: boolean = false;

  constructor() {
    super();
    this.user = new User();
  }

  mounted(): void {
    this.$socketIo.on(SocketEvents.JoinResult, (joinResult: boolean) => {
      this.errorJoiningGame = !joinResult;
      this.loadingGame = joinResult;

      if (joinResult) {
        this.$router.push({ name: Routes.Game, params: {username: this.user.Username }});
      }
    });
  }

  createGame(): void {
    // Direct the user through the create game route
    this.$socketIo.emit(SocketEvents.CreateGame, this.user.Username); 
    // TODO: Push the room id into a global list.  
  }

  joinGame(): void {
    this.$socketIo.emit(SocketEvents.JoinGame, this.user.Username);
    //TODO: Change the route to a lobby component
    //TODO: Have a list of available games (global list)
    // {{socket.id}}
    // v-on:click="joinGame(socket.id)"

  }
}
</script>