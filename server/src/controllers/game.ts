import {Request, Response} from "express";
import {State} from "../models/State";
import {User} from "../models/User";
import userController from "./user";

export interface StateInterface {
    _id: string;
    players: StatePlayer[];
    board:  StateBoard;
}

interface StatePlayer {
    id: string;
    username: string;
    color: string;
    playerBoxes: number;
    role: string;
    isOnline: boolean;
    [key: string]: string | number | boolean;
}

interface StateBoard {
    x: number;
    y: number;
    nextMove: string;
    lineCoords: string[];
    history: string[];
    winner: string;
    chat: {[key: string]: string}[];
    [key: string]: string | number | string[] | {[key: string]: string}[];
}

const gameController = {

    addPlayer(data: {[key: string]: any}, state: StateInterface): StateInterface {
        const index = state.players.find((user: StatePlayer) => user.role === "firstPlayer");
        data.role = index ? "secondPlayer" : "firstPlayer";
        if (state.players.length === 0) {
            state.board.x = data.x;
            state.board.y = data.y;
        }

        if (state.players.length < 2) {
            state.players.push({
                id: data.id,
                username: data.username,
                color: data.color,
                playerBoxes: 0,
                role: data.role,
                isOnline: true,
            });

            if(data.role === "secondPlayer") {
                state.board.nextMove = data.username;
            }
        }
        if (state.players.length === 2 && state.players.find((player) => player.id === data.id)) {
            const index = state.players.findIndex((player) => player.id === data.id);
            state.players[index].isOnline = true;
        }

        return state;
     },

    updatePlayerState(data: { [key: string]: string }, state: StateInterface): StateInterface {
        const index: number = state.players.findIndex((user: StatePlayer) => user.id === data.id);
        if (data.key === "username" && data.val && state.board.nextMove === state.players[index].username) {
            state.players[index][data.key] = data.val;
            state.board.nextMove = data.val;
        } else {
            state.players[index][data.key] = data.val;
        }

        return state;
    },

    updateBoardState(data: { [key: string]: number | string}, state: StateInterface): StateInterface {
        if (data.val < 3 || data.val > 10 || state.board.history.length) {
            return state;
        }
        state.board[data.key] = data.val;

        return state;
    },


     nextMove(data: { [key: string]: string }, state: StateInterface): StateInterface {
        if (state.players.length === 2) {

            state.board.lineCoords.push(data.coords);


            if (state.board.nextMove === state.players[0].username) {
                state.board.nextMove = state.players[1].username;
                state.board.history.push(state.players[1].username);
            } else {
                state.board.nextMove = state.players[0].username;
                state.board.history.push(state.players[0].username);
            }
        }

        return state;
    },

    count(data: { [key: string]: string }, state: StateInterface): StateInterface {
        if (data.move === state.players[0].username) {
            state.players[0].playerBoxes = state.players[0].playerBoxes + 1;
            state.board.nextMove = state.players[1].username;
        } else {
            state.players[1].playerBoxes = state.players[1].playerBoxes + 1;
            state.board.nextMove = state.players[0].username;
        }

        const allBoxes = state.board.x * state.board.y;
        const index = state.players.findIndex((user: StatePlayer) => user.role === "firstPlayer");
        const firstPlayerBoxes = state.players[index].playerBoxes;
        const secondPlayerBoxes = state.players[index + 1].playerBoxes;
        if (firstPlayerBoxes + secondPlayerBoxes >= allBoxes) {
            if (firstPlayerBoxes > secondPlayerBoxes) {
                state.board.winner = state.players[index].username;
            } else if (firstPlayerBoxes < secondPlayerBoxes) {
                state.board.winner = state.players[index + 1].username;
            } else if (firstPlayerBoxes === secondPlayerBoxes) {
                state.board.winner = "No Winner";
            }

            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            const date = new Date();
            const data = {
              players: [state.players[0].username, state.players[1].username],
              colors: [state.players[0].color, state.players[1].color],
              score: [state.players[0].playerBoxes, state.players[1].playerBoxes],
              date: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}`
            }
            userController.updateHistory(state.players[0].id, data);
            userController.updateHistory(state.players[1].id, data);
        }
        return state;
    },

    playerDisconnect(data: { [key: string]: string }, state: StateInterface): StateInterface {
        const index = state.players.findIndex((user: StatePlayer) => user.id === data.id);
        state.players[index].isOnline = false;
        state.players[index].playerBoxes = 0;

        return state;
    },

    sendMessage(data: {[key: string]: string}, state: StateInterface): StateInterface {
        state.board.chat.push(data)
        return state;
    },

    async getGames(req: Request, res: Response) {
        const states = await State.find({}, {})

        const data = states.map((state: any) => {
            return {
                _id: state._id,
                firstPlayer: state.players[0] ? [state.players[0].username, state.players[0].color, state.players[0].playerBoxes, state.players[0].isOnline] : [],
                secondPlayer: state.players[1] ? [state.players[1].username, state.players[1].color, state.players[1].playerBoxes, state.players[1].isOnline] : [],
            }
        })
        return res.json(data)
    },

    async getScores(req: Request, res: Response) {
        const users = await User.find({}, {})

        const data = users.map((user: any) => {
            return {
                username: user.username,
                color: user.color,
                scores: user.scores,
                history: user.history
            }
        })
        return res.json(data)
    },

};

export default gameController;
