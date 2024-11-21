"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
exports.createRoom = createRoom;
const uuid_1 = require("uuid");
const rooms = {};
function createRoom(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = (0, uuid_1.v4)();
        rooms[roomId] = [];
        console.log(roomId);
        socket.emit("room-created", { roomId });
        console.log("user created the room");
        return roomId;
    });
}
;
const roomHandler = (socket, roomId) => {
    const joinRoom = ({ roomId, peerId }) => {
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
    const leaveRoom = ({ peerId, roomId }) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
        }
        socket.to(roomId).emit("user-disconnected", peerId);
    };
    const startSharing = ({ roomId, peerId }) => {
        socket.to(roomId).emit("user-started-sharing", peerId);
    };
    const stopSharing = (roomId) => {
        socket.to(roomId).emit("user-stopped-sharing");
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
};
exports.roomHandler = roomHandler;
