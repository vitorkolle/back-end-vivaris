import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import { any } from "zod";

const rooms: Record<string, string[]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
}

export async function createRoom(socket: Socket){
    const roomId = uuidV4();
    rooms[roomId] = [];
    console.log(roomId);

    socket.emit("room-created", { roomId });
    console.log("user created the room");

    return roomId
};

export const roomHandler = (socket: Socket, roomId:String) => {

    const joinRoom = ({ roomId, peerId }: IRoomParams) => {
        if (!rooms[roomId]) {

            rooms[roomId] = [];
        }

        console.log("user joined the room: ", roomId, peerId);
        rooms[roomId].push(peerId);
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", {
            peerId,
        });

        socket.emit("get-users", {
            participants: rooms[roomId],
            roomId,
        });

        socket.on("disconnect", () => {
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
        }
        socket.to(roomId).emit("user-disconnected", peerId);
    };

    const startSharing = ({ roomId, peerId }: IRoomParams) => {
        socket.to(roomId).emit("user-started-sharing", peerId);
    };

    const stopSharing = ( roomId: string) => {
        socket.to(roomId).emit("user-stopped-sharing");
    };

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
};
