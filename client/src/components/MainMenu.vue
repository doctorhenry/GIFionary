<template>
  <div>
    <div>
      <label for="username">Username:</label>
      <input type="Text" v-model="user.Username" name="username" />
    </div>

    <div>
      <button v-on:click="createGame()">Create Game</button>
      <button v-on:click="showGames()">Show active games</button>
    </div>

    <div v-show="errorJoiningGame">
      <span style="color: red; font-size: 18px;">An error has occurred</span>
    </div>

    <div v-show="(loadingGame && !errorJoiningGame)">
      <span style="color: green; font-size: 18px;">Waiting for more players to join...</span>
    </div>

    <div v-for="(r, index) in rooms" :key="index">
      <button v-on:click="joinGame(r)" class="btn">{{r}}</button>
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
import Room from "../../../library/models/room";
import Router from "vue-router";

@Component
export default class MainMenu extends Vue {
  public user: User;
  public room: Room;
  public errorJoiningGame: boolean = false;
  public loadingGame: boolean = false;
  public rooms: string[];
  public selectedRoom: string;

  constructor() {
    super();
    this.user = new User();
    this.room = new Room();
    this.rooms = [];
    this.selectedRoom = '';
  }

  mounted(): void {
    this.$socketIo.on(SocketEvents.JoinResult, (joinResult: boolean) => {
      this.errorJoiningGame = !joinResult;
      this.loadingGame = joinResult;

      if (joinResult) {
        this.$router.push({
          name: Routes.Game,
          params: { username: this.user.Username, roomId: this.selectedRoom }
        });
      }
    });
  }

  createGame(): void {
    // Direct the user through the create game route
    this.$socketIo.emit(SocketEvents.CreateGame, this.user.Username);
  }

  showGames(): void {
    this.$socketIo.emit(SocketEvents.GetLobby, "");
    console.log("emitted");
    //TODO: Change the route to a lobby component

    this.$socketIo.on(SocketEvents.ShowLobby, (activeRooms: string[]) => {
      console.log("listening");
      console.log(activeRooms);
      this.rooms = activeRooms;
    });
  }

  joinGame(selectedRoom:string): void {
    this.selectedRoom = selectedRoom;
    Room.RoomId = selectedRoom;
    this.$socketIo.emit(SocketEvents.JoinGame, this.user.Username,selectedRoom);
  }
}
</script>