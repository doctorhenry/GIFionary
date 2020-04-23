import Vue from "vue";
import io from "socket.io-client";
import SocketEvents from "../../../library/constants/socketEvents";

declare module "vue/types/vue" {
    interface Vue {
        $socketIo: SocketIOClient.Socket;
    }
}