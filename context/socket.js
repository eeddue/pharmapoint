import { io } from "socket.io-client";
const socket = io.connect("https://pharmapoint-822e63c79731.herokuapp.com");
export default socket;
