import { io } from "socket.io-client";

// Connect to your backend Socket.IO server
export const socket = io("http://localhost:3000", {
  withCredentials: true, // if using cookies
});