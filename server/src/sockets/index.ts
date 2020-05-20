import connection from "./connection";
import auth from "./auth";
import io from "socket.io";

const IO = io();

IO.use(auth);
IO.on("connection", connection);

export default IO;