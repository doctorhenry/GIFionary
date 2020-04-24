<style>
.user-position {
  position: absolute;
  height: 75px;
  width: 75px;
  border-radius: 50%;
}

.user-0 {
  left: 50%;
  bottom: -37.5px;
  background-color: #3298dc;
}

.user-1 {
  left: -37.5px;
  bottom: 50%;
  background-color: #ffdd57;
}

.user-2 {
  bottom: 50%;
  right: -37.5px;
  background-color: #f14668;
}

.user-3 {
  top: -37.5px;
  left: 50%;
  background-color: #48c774;
}
</style>

<template>
  <div>
    <div v-if="userGame.Users" class="container">
      <div class="is-fullheight hero">
        <div class="columns is-multiline">
          <div class="column is-12 columns is-vcentered" style="height: 75vh">
            <div class="column card" style="min-height: 400px;">
              <div
                v-for="(user, index) in userGame.Users"
                :key="user.Username"
                v-bind:class="'user-' + index"
                class="user-position"
                v-on:click="!showUserDetails"
              >
                <div style="width: 75px;height: 75px;position: relative;">
                  <div
                    style="position: absolute; right: -100px;top: 50%;transform: translateY(-50%);"
                    v-show="showUserDetails"
                  >
                    <div
                      style="padding: 1rem;border: 1px solid black;"
                      class="card"
                    >{{user.Username}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-12" style="height: 25vh">
            <div class="tile notification is-info" style="height: 100%;">
              <div class="card" v-for="gif in userGame.Gifs" :key="gif.Id">
                <img :src="gif.Url" />
              </div>
            </div>
          </div>
        </div>
        <!-- 
        <h1 v-show="!canPlay && gameReady">Waiting on Decider...</h1>

        <div class="level">
          <h2>You are playing as {{username}}</h2>
          <h2>Your server ID is {{roomId}}</h2>
        </div>

        <div class="level">
          <h2>Decider Cards:</h2>

        </div>-->
      </div>
    </div>

    <div
      v-if="!gameReady"
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
import { Component, Vue, Prop } from "vue-property-decorator";
import SocketEvents from "../../../library/constants/socketEvents";
import UserGame from "../../../library/models/userGame";
import User from "../../../library/models/user";
import UserRoom from "../../../library/models/userRoom";

@Component
export default class Game extends Vue {
  @Prop() username?: string;
  @Prop() roomId?: string;

  public gameReady = false;
  public canPlay = false;
  public userGame: UserGame = new UserGame();
  public showUserDetails: boolean = false;

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
    // Call userGame ready method here
    console.log(this.username);
    console.log(this.roomId);
    this.$socketIo.emit(SocketEvents.UserReady, this.username, this.roomId);

    this.$socketIo.on(SocketEvents.CanPlay, () => {
      this.canPlay = true;
    });

    this.$socketIo.on(SocketEvents.GameUpdate, (userGame: UserGame) => {
      this.gameReady = true;
      this.userGame = userGame;
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

  destroyed(): void {
    this.$socketIo.emit(SocketEvents.LeaveRoom, this.username, this.roomId);
  }
}
</script>