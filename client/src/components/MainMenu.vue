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
      <button v-on:click="joinGame(r)" class="btn">{{r.Id}}</button>
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
import UserRoom from "../../../library/models/userRoom";
import ValidationResult from "../../../library/models/validationResult";

@Component
export default class MainMenu extends Vue {
  public user: User;
  public selectedRoom: UserRoom;
  public rooms: UserRoom[];
  public errorJoiningGame: boolean = false;
  public loadingGame: boolean = false;

  constructor() {
    super();
    this.user = new User();
    this.selectedRoom = new UserRoom();
    this.rooms = [];
  }

  mounted(): void {
    this.$socketIo.on(SocketEvents.JoinResult, (joinResult: ValidationResult<string>) => {
      this.errorJoiningGame = !joinResult;
      this.loadingGame = joinResult.IsSuccess;

      if (joinResult) {
        this.$router.push({
          name: Routes.Game,
          params: { username: this.user.Username, roomId: joinResult.Data }
        });
      }
    });
  }

  createGame(): void {
    this.$socketIo.emit(SocketEvents.CreateGame, this.user.Username);
  }

  showGames(): void {
    this.$socketIo.emit(SocketEvents.GetLobby);
    //TODO: Change the route to a lobby component

    this.$socketIo.on(SocketEvents.ShowLobby, (activeRooms: UserRoom[]) => {
      this.rooms = activeRooms;
    });
  }

  joinGame(selectedRoom: UserRoom): void {
    this.selectedRoom = selectedRoom;

    this.$socketIo.emit(
      SocketEvents.JoinGame,
      this.user.Username,
      selectedRoom.RoomId
    );
  }
}
</script>