import { io } from "socket.io-client";

// Connect to your backend Socket.IO server
export const socket = io(`${import.meta.env.VITE_API_URL}`, {
  withCredentials: true, // if using cookies
});