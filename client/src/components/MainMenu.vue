<template>
  <div class="container">
    <div class="has-text-centered">
      <h1 class="title"> GIFionary! </h1>
    </div>
    <div class="is-fullheight hero">
      <div class="columns is-multiline is-centered card" style="margin: auto 0;">
        <div class="column is-8">
          <label class="label" for="username">Username:</label>

          <div class="control has-icons-left">
            <input
              class="input is-primary"
              placeholder="Enter a username"
              type="Text"
              v-model="user.Username"
              name="username"
            />

            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="column is-8 buttons">
          <button :disabled = "user.Username.length < 1" class="button is-primary" v-on:click="createGame()">Create Game</button>
          <button :disabled = "user.Username.length < 1" class="button is-link" v-on:click="showGames()">Show active games</button>
        </div>

        <div v-show="errorJoiningGame" class="column is-8">
          <span class="is-danger is-large">An error has occurred</span>
        </div>

        <div v-show="(loadingGame && !errorJoiningGame)" class="column is-8">
          <span class="is-primary is-large">TEST: {{thisRoomId}}</span>
          <span class="is-primary is-large">Waiting for more players to join...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Routes from "../../../library/constants/routes";
import SocketEvents from "../../../library/constants/socketEvents";
import Environment from "../environments/environment";
import User from "../../../library/models/user";
import UserRoom from "../../../library/models/userRoom";
import ValidationResult from "../../../library/models/validationResult";

@Component
export default class MainMenu extends Vue {
  @Prop() usernameProp?: string;

  public user: User  = new User();
  public rooms: UserRoom[] = [];
  public errorJoiningGame: boolean = false;
  public loadingGame: boolean = false;
  public thisRoomId: string = "";

  mounted(): void {
    this.user.Username = this.usernameProp ? this.usernameProp : "";

    this.$socketIo.on(SocketEvents.CreateResult, (joinResult: ValidationResult<string>) => {
        console.log("Hola");
        this.errorJoiningGame = !joinResult;
        this.loadingGame = joinResult.IsSuccess;
        this.thisRoomId = joinResult.Data;
        console.log(this.thisRoomId);

        if (joinResult) {
          this.$router.push({
            name: Routes.Game,
            params: { username: this.user.Username, roomId: joinResult.Data }
          });
        }
      }
    );
  }

  createGame(): void {
    this.$socketIo.emit(SocketEvents.CreateGame, this.user.Username);
  }

  showGames(): void {
    this.$router.push({
      name: Routes.RoomList,
      params: { usernameProp: this.user.Username }
    });
  }
}
</script>