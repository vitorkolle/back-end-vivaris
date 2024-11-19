import { Socket } from "socket.io";
export declare function createRoom(socket: Socket): Promise<string>;
export declare const roomHandler: (socket: Socket, roomId: String) => void;
