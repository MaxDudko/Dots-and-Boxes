import IO from "./index";
import {Socket} from "socket.io";
import {State} from "../models/State";
import gameController from "../controllers/game";
const {
    addPlayer,
    updatePlayerState, updateBoardState,
    nextMove, count,
    playerDisconnect, sendMessage
} = gameController;

const connection = (socket: Socket): void => {
    console.log("New client connected: ", socket.id);
    let session_id: string;
    let id: string;

    const saveState = (fn: any) => async (data: { [key: string]: string }): Promise<void> => {
        let state: any = await State.findById(data.session_id);
        state = fn(data, state);
        if (state.players.length === 0) {
            await state.remove();
        } else {
            await state.save();
        }

        IO.sockets.to(state._id).emit('state', state);
        return state;
    }

    const createNewState = async (data: { [key: string]: string }): Promise<void> => {
        const state = new State();
        await state.save();
        data.session_id = state._id;
        session_id = state._id;
        id = data.id;

        socket.join(state.id)
        await saveState(addPlayer)(data);
    }

    socket.on("newPlayer", (data: { [key: string]: string }): void => {
        if (!data.session_id) {
            createNewState(data);

        } else {
            session_id = data.session_id;
            id = data.id;
            socket.join(data.session_id)
            saveState(addPlayer)(data);
        }
    });

    socket.on("updatePlayerState", saveState(updatePlayerState));

    socket.on("updateBoardState", saveState(updateBoardState));

    socket.on("nextMove", saveState(nextMove));

    socket.on("count", saveState(count));

    socket.on("sendMessage", saveState(sendMessage));

    socket.on("disconnect", () => {
        saveState(playerDisconnect)({id: id, session_id: session_id});
        socket.leave(session_id);
    });
}

export default connection;