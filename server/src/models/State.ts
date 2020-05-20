import Mongoose, {Schema} from "mongoose";

interface State extends Mongoose.Document {
    players: Mongoose.Document;
    board: Mongoose.Document;
}

const PlayerSchema: Schema = new Mongoose.Schema({
    id: String,
    username: String,
    color: String,
    playerBoxes: Number,
    role: String,
    isOnline: Boolean
});

const BoardSchema: Schema = new Mongoose.Schema({
    x: {
        type: Number,
        default: 3
    },
    y: {
        type: Number,
        default: 3
    },
    nextMove: {
        type: String,
        default: ""
    },
    lineCoords: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    winner: {
        type: String,
        default: "",
    },
    chat: {
        type: Array,
        default: [],
    }
});

const StateSchema: Schema = new Mongoose.Schema({
    players: {
        type: [PlayerSchema],
    },
    board: {
        type: BoardSchema,
        default: BoardSchema
    }
});
StateSchema.methods.toObject = function (): {[key: string]: {[key: string]: string | number | boolean | string[]}} {
    return {
        _id: this._id,
        players: this.players,
        board: this.board,
    }
};

export const State = Mongoose.model<State>('State', StateSchema);
