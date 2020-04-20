import Vue from "vue";
import io from "socket.io-client";

declare module "vue/types/vue" {
    interface Vue {
        $socketIo: SocketIOClient.Socket;
    }
}