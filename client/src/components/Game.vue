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
    <div v-if="users.length > 0" class="container">
      <div>
        <div v-if="thisPlayerIsDecider()">
          <button class="button is-danger" v-on:click="leaveGame()">Leave Game</button>
        </div>
        <div>{{currentPoints}}</div>
        <div class="columns is-multiline">
          <div class="column is-12" style="height: 50vh; margin-top: 3rem;">
            <div class="column card" style="min-height: 400px; padding: 3rem;">
              <div class="columns">
                <div
                  v-show="playedGifs.length > 0"
                  v-for="gif in playedGifs"
                  v-bind:class="{ 'image-clickable': thisPlayer.CanDecide }"
                  v-on:click="selectPlayedGif(gif)"
                  :key="gif.Id"
                  class="column is-3"
                >
                  <img :src="gif.Url" style="transition: all .3s;" />
                </div>

                <div v-show="selectedGif.Url" class="column is-3">
                  <img :src="selectedGif.Url" />
                </div>
              </div>

              <div
                v-for="(user, index) in users"
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
          <div class="column is-12" style="height: 35vh">
            <div class="buttons">
              <button
                v-on:click="playerConfirmSelection()"
                :disabled="!thisPlayer.CanPlay || !selectedGif.Url"
                class="button is-success"
                type="button"
              >Confirm Selection</button>
            </div>
            <transition-group
              name="gif-list"
              tag="div"
              class="tile notification is-info"
              style="height: 100%;"
            >
              <div
                class="image-clickable gif-list-item"
                v-for="gif in gifsInHand"
                :key="gif.Id"
              >
                <img :src="gif.Url" v-on:click="selectGif(gif)" />
              </div>
            </transition-group>
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
          style="width: 100%;
    text-align: center;    
    top: 50%;    
    font-size: 20px;"
        >You are in room: {{roomId}}</div>
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




    <div
      v-if="showWinnerElement"
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
        >The round was won by {{winningPlayer}}</div>
      </div>

      <button class="btn is-success" v-on:click="resetRound()">Continue</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Routes from "../../../library/constants/routes";
import SocketEvents from "../../../library/constants/socketEvents";
import User from "../../../library/models/user";
import UserRoom from "../../../library/models/userRoom";
import Gif from "../../../library/models/gif";
import UserRound from "../../../library/models/userRound";
import PlayedGif from "../../../library/models/playedGif";
import { UserType } from "../../../library/enums/userType";

@Component
export default class Game extends Vue {
  @Prop() username?: string;
  @Prop() roomId?: string;

  public gameReady: boolean = false;
  public thisPlayer: User = new User();
  public showUserDetails: boolean = true;
  public gifsInHand: Gif[] = [];
  public selectedGif: Gif = new Gif();
  public playedGifs: Gif[] = [];
  public users: User[] = [];
  private winningPlayer : string = "";
  private showWinnerElement : boolean = false;
  private currentPoints: number = 0;

  private userHasInvalidRoomId = () => !this.roomId;

  public thisPlayerIsDecider() {
    return this.thisPlayer.UserType === UserType.Decider;
  }

  mounted(): void {
    if (this.userHasInvalidRoomId()) {
      this.goToMainMenu();
    }

    // Navigate all other players in the room to the home page.
    this.$socketIo.on(SocketEvents.NavigateHome, () => {
      this.goToMainMenu();
    });

    this.$socketIo.emit(SocketEvents.UserReady, this.username, this.roomId);

    this.$socketIo.on(SocketEvents.NewBatchOfGifs, (gifs: Gif[]) => {
      this.gifsInHand = gifs;
    });

    this.$socketIo.on(SocketEvents.RoundUpdate, (round: UserRound) => {
      this.selectedGif = new Gif();
      this.playedGifs = round.PlayedGifs;
    });

    this.$socketIo.on(SocketEvents.UsersUpdate, (users: User[]) => {
      this.updateUsers(users);
    });

    this.$socketIo.on(SocketEvents.AwardPoint, (player: string, points:number) => {
      this.showWinner(player,points);
    });

  }

  selectGif(gif: Gif): void {
    if (this.thisPlayer.CanPlay && !this.thisPlayer.CanDecide) {
      this.selectedGif = gif;
    }
  }

  selectPlayedGif(gif: PlayedGif): void {
    if (this.thisPlayer.CanDecide) {
      
      // TODO: Obtain the winner of the round
      let winningPlayer = this.users.find(user => user.Username === gif.PlayerUsername)
      if (winningPlayer)
      {       
        // TODO: Emit winner of round
        this.$socketIo.emit(SocketEvents.GameWon,winningPlayer.Username,this.roomId);
      }

    }
  }

  playerConfirmSelection(): void {
    const playedGif = <PlayedGif>{
      PlayerUsername: this.username,
      Id: this.selectedGif.Id,
      Url: this.selectedGif.Url
    };

    this.gifsInHand.splice(this.gifsInHand.indexOf(this.selectedGif), 1);

    if (this.thisPlayerIsDecider()) {
      this.$socketIo.emit(
        SocketEvents.DeciderHandSubmit,
        this.roomId,
        playedGif
      );
    } else {
      this.$socketIo.emit(
        SocketEvents.PlayersHandSubmit,
        this.roomId,
        playedGif
      );
    }
  }

  /*
   - Socket - SwitchPlayerTurn
    - Sets each user's CanDecide variable
    - Sets each user's CanPlay variable
    - Sets all user's PlayedGifs variable
    - Sets all user's Points variable

   - Socket - RoundUpdate
      - Updated Round Number
      - 
      

    - Socket - UpdateUsersHand
      - A gif to add to the user's collection

  */

  leaveGame(): void {
    console.log("sending command" + this.roomId);
    this.$socketIo.emit(SocketEvents.ObliterateRoom, this.roomId);
    // Navigate the decider home
    this.goToMainMenu();
  }

  beforeDestroy(): void {
    this.$socketIo.emit(SocketEvents.LeaveRoom, this.username, this.roomId);
  }

  private goToMainMenu(): void {
    this.$router.push({
      name: Routes.Mainmenu
    });
  }

  private updateUsers(users: User[]): void {
    if (!this.gameReady) {
      this.gameReady = true;
    }

    const thisPlayer = users.find(user => user.Username === this.username);

    if (thisPlayer) {
      this.thisPlayer = thisPlayer;
      this.users = users;
    }
  }

  private showWinner(player:string, points:number) :void{
    this.showWinnerElement = true;
    this.winningPlayer = player;
    // If this is the winner award the point...malaka
    if (this.thisPlayer.Username === player)
    {
      this.currentPoints = points;      
    }
    
  }

  private resetRound():void{
    this.showWinnerElement = false;
    // TODO: Reset all of the round variables -- Ask Bezz
// TODO emit to the server currentroom.currenround
  }
}
</script>