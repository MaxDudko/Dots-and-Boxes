import "mocha";
import { expect } from "chai";
import {} from "sinon";

import gameController, {StateInterface} from "../../src/controllers/game";
const {
    addPlayer,
    updatePlayerState, updateBoardState,
    nextMove, count,
    playerDisconnect
} = gameController;

const state = (): StateInterface => {
    return {
        _id: "id-123",
        players: [
            {
                id: "1111",
                username: "User_1",
                color: "#ffffff",
                playerBoxes: 0,
                role: "firstPlayer",
                isOnline: true
            },
            {
                id: "2222",
                username: "User_2",
                color: "#000000",
                playerBoxes: 0,
                role: "secondPlayer",
                isOnline: true
            }
        ],
        board: {
            x: 3,
            y: 3,
            nextMove: "User_2",
            lineCoords: [],
            history: [],
            winner: "",
            chat: []
        }
    }
}

describe("Game Logic: ", () => {
    describe("Create Game", () => {
        it ("First player connect", () => {
            const data = {id: "1111", username: "User_1", color: "#ffffff", x: 4, y: 4}
            const newState = state();
            newState.board.nextMove = "";
            newState.players.splice(0);
            newState.players.push({
                id: "1111",
                username: "User_1",
                color: "#ffffff",
                playerBoxes: 0,
                role: "firstPlayer",
                isOnline: true
            });
            newState.board.x = 4;
            newState.board.y = 4;

            const updatedState = state();
            updatedState.board.nextMove = "";
            updatedState.players.splice(0);

            expect(addPlayer(data, updatedState)).to.deep.equal(newState)
        })
        it ("Second player connect", () => {
            const data = {id: "2222", username: "User_2", color: "#000000"}
            const newState = state();

            const updatedState = state();
            updatedState.board.nextMove = "";
            updatedState.players.splice(1);

            expect(addPlayer(data, updatedState)).to.deep.equal(newState)
        })
        it ("Third player can not connect", () => {
            const data = {id: "3333", username: "User_3", color: "#ff0000", role: "thirdPlayer"}

            expect(addPlayer(data, state())).to.deep.equal(state())
        })
    });

    describe("Update player data", () => {
        it('Update username', () => {
            const data = {id: "1111", key: "username", val: ""}
            const newState = state();
            newState.players[newState.players.findIndex((e) => e.id === "1111")].username = ""
            expect(updatePlayerState(data, state())).to.deep.equal(newState)
        })
        it ('Update color', () => {
            const data = {id: "2222", key: "color", val: "#ff0000"}
            const newState = state();
            newState.players[newState.players.findIndex((e) => e.id === "2222")].color = "#ff0000"
            expect(updatePlayerState(data, state())).to.deep.equal(newState)
        })
    })

    describe("Update game board size", () => {
        it('Update X', () => {
            const data = {key: "x", val: 4}
            const newState = state();
            newState.board[data.key] = data.val
            expect(updateBoardState(data, state())).to.deep.equal(newState)
        })
        it ('Update Y', () => {
            const data = {key: "y", val: 5}
            const newState = state();
            newState.board[data.key] = data.val
            expect(updateBoardState(data, state())).to.deep.equal(newState)
        })
        it ('Can not update size because value < 3', () => {
            const data = {key: "x", val: 2}
            const newState = state();
            expect(updateBoardState(data, state())).to.deep.equal(newState)
        })
        it ('Can not update size because value > 10', () => {
            const data = {key: "x", val: 20}
            const newState = state();
            expect(updateBoardState(data, state())).to.deep.equal(newState)
        })
        it ('Can not update size because game started', () => {
            const data = {key: "y", val: "5"}
            const updatedState = state();
            updatedState.board.lineCoords.push("100,100 200,100");
            updatedState.board.history.push("User_1");
            updatedState.board.nextMove = "User_1";
            const newState = state();
            newState.board.lineCoords.push("100,100 200,100");
            newState.board.history.push("User_1");
            newState.board.nextMove = "User_1";
            expect(updateBoardState(data, updatedState)).to.deep.equal(newState)
        })
    })

    describe("Making Move", () => {
        it ("Player make a move ", () => {
            const data = {coords: "100,100 200,100"}
            const newState = state();
            newState.board.lineCoords.push(data.coords);
            newState.board.history.push("User_1");
            newState.board.nextMove = "User_1";
            expect(nextMove(data, state())).to.deep.equal(newState)
        })
        it ("Player cannot make move, because second player is not connected", () => {
            const data = {coords: "100,100 200,100"}
            const newState = state();
            newState.players.splice(1);
            newState.board.nextMove = "";

            const updatedState = state();
            updatedState.players.splice(1);
            updatedState.board.nextMove = "";
            expect(nextMove(data, updatedState)).to.deep.equal(newState)
        })
    });

    describe("Count Boxes", () => {
        it ("Count boxes", () => {
            const data = {move: "User_1"}
            const newState = state();
            newState.players[0].playerBoxes = 1;
            newState.board.nextMove = "User_2";
            expect(count(data, state())).to.deep.equal(newState)
        })
        it ("Firs player Win", () => {
            const data = {move: "User_1"}
            const newState = state();
            newState.players[0].playerBoxes = 5;
            newState.players[1].playerBoxes = 4;
            newState.board.nextMove = "User_2";
            newState.board.winner = "User_1"

            const updatedState = state();
            updatedState.players[0].playerBoxes = 4;
            updatedState.players[1].playerBoxes = 4;
            expect(count(data, updatedState)).to.deep.equal(newState)
        })
        it ("No winner", () => {
            const data = {move: "User_2"}
            const newState = state();
            newState.board.x = 4;
            newState.board.y = 4;
            newState.players[0].playerBoxes = 8;
            newState.players[1].playerBoxes = 8;
            newState.board.nextMove = "User_1";
            newState.board.winner = "No Winner"

            const updatedState = state();
            updatedState.board.x = 4;
            updatedState.board.y = 4;
            updatedState.players[0].playerBoxes = 8;
            updatedState.players[1].playerBoxes = 7;
            expect(count(data, updatedState)).to.deep.equal(newState)
        })
    });
    describe("Disconnected players", () => {
        it("Player disconnect", () => {
            const data = {id: "1111", username: "User_1", color: "#ffffff", role: "firstPlayer"}
            const newState = state();
            newState.players[0].isOnline = false;

            const updatedState = state();

            expect(playerDisconnect(data, updatedState)).to.deep.equal(newState)
        })
        it("Player reconnect", () => {
            const data = {id: "1111", username: "User_1", color: "#ffffff", role: "firstPlayer"}
            const newState = state();

            const updatedState = state();
            updatedState.players[0].isOnline = false;

            expect(addPlayer(data, updatedState)).to.deep.equal(newState)
        })
    });
})