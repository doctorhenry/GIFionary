<template>
  <div class="container">
    <div class="is-fullheight hero">
      <div class="columns is-multiline is-centered card" style="margin: auto 0; max-height: 90vh">
        <div class="column is-8">
          <button v-on:click="goToMainMenu()" class="button is-white icon is-medium">
            <i class="fas fa-times-circle"></i>
          </button>
        </div>
        <div class="column is-8">
          <table class="table is-bordered is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Room Id</th>
                <th>Hosted By</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="room in rooms"
                :key="room.RoomId"
                v-on:click="goToGame(room)"
                style="cursor: pointer"
              >
                <td>{{room.RoomId}}</td>
                <td>{{room.HostedBy}}</td>
                <td>{{room.PlayerCount}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SocketEvents from "../../../library/constants/socketEvents";
import UserRoomDetail from "../../../library/models/userRoomDetail";
import Routes from "../../../library/constants/routes";
import ValidationResult from "../../../library/models/validationResult";

@Component
export default class Game extends Vue {
  @Prop() usernameProp?: string;

  public rooms: UserRoomDetail[] = [];
  public username: string = "";

  mounted(): void {
    if (this.usernameProp) {
      this.username = this.usernameProp;
    }

    this.$socketIo.emit(SocketEvents.GetRooms);

    this.$socketIo.on(SocketEvents.ShowRooms, (rooms: UserRoomDetail[]) => {
      this.rooms = rooms;
    });

    this.$socketIo.on(
      SocketEvents.JoinResult,
      (joinResult: ValidationResult<string>) => {

        if (joinResult) {
          this.$router.push({
            name: Routes.Game,
            params: { username: this.username, roomId: joinResult.Data }
          });
        }
      }
    );
  }

  goToMainMenu(): void {
    this.$router.push({
      name: Routes.Mainmenu,
      params: { usernameProp: this.username }
    });
  }

  goToGame(room: UserRoomDetail): void {
    this.$socketIo.emit(SocketEvents.JoinGame, this.username, room.RoomId);
  }
}
</script>