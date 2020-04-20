<template>
  <div>
    <input type="Text" v-model="username" />

    <button v-on:click="buttonClicked()">yo</button>

    <router-link :to="gameLink">Login</router-link>

    <input v-model="gameGuid" />

    {{gameGuid}}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Routes from "../../../library/constants/routes";
import SocketEvents from "../../../library/constants/socketEvents";

export default class Login extends Vue {
  public readonly gameLink = `/${Routes.Game}`;
  public username: string = "";
  public gameGuid: string = "";

  mounted(): void {
    this.$socketIo.on(SocketEvents.JoinResult, (result: string) => {
      this.gameGuid = result;
    });
  }

  buttonClicked() {
    this.$socketIo.emit(SocketEvents.CreateGame, this.username);
  }
}
</script>