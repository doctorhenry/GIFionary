import io from "socket.io-client";
import Environment from '@/environments/environment';

export class SocketIoService {
    public static socketIo = io(Environment.WebSocketUrl);
}