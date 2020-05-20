import {AnyAction} from "redux";

interface Scores {
  username: string;
  color: string;
  scores: number;
  history: {[key: string]: string|string[]|number[]}[];
}

export interface Game {
  session_id: string;
  isGameStart: boolean;
  x: number;
  y: number;
  l: number;
  firstPlayerBoxes: number;
  secondPlayerBoxes: number;
  nextMove: string;
  lineCoords: string[];
  history: string[];
  allBoxes: number;
  counter: number;
  playerWin: string;
  scores: Scores[];
  games: {[key: string]: string}[];
  chat: {[key: string]: string}[];
  // [key: string]: any;
}

export const initialState = {
  session_id: '',
  isGameStart: false,
  x: 3,
  y: 3,
  l: 100,
  firstPlayerBoxes: 0,
  secondPlayerBoxes: 0,
  nextMove: '',
  lineCoords: [] as string[],
  history: [] as string[],
  allBoxes: 0,
  counter: 0,
  playerWin: '',
  scores: [] as Scores[],
  games: [] as {[key: string]: string}[],
  chat: [] as {[key: string]: string}[],
};

export const game = (state: Game = initialState, action: AnyAction): Game => {
  switch (action.type) {
    case 'calc_l':
      return {
        ...state,
        l: action.payload.val
      };
    case 'CHANGE_SIZE':
      return {
        ...state,
        [action.payload.key]: action.payload.val
      };

    case 'SET_SESSION_ID':
      return {
        ...state,
        session_id: action.payload.val
      };
    case 'SET_COUNTER':
      return {
        ...state,
        allBoxes: action.payload.val
      };

    case 'NEXT_MOVE':
      return {
        ...state,
        nextMove: action.payload.val,
      };

    case 'SET_COORDS':
      return {
        ...state,
        lineCoords: action.payload.coords,
        history: action.payload.history

      };

    case 'SET_BOXES':
      return {
        ...state,
        [action.payload.key]: action.payload.val
      };

    case 'IS_VICTORY':
      return  {
        ...state,
        playerWin: action.payload.name
      };

    case 'START_GAME':
      return {
        ...state,
        isGameStart: !state.isGameStart
      };

    case 'RESTART_GAME':
      return {
        ...state,
        firstPlayerBoxes: 0,
        secondPlayerBoxes: 0,
        lineCoords: [],
        allBoxes: 0,
        counter: 0,
        playerWin: '',
        isGameStart: !state.isGameStart
      };
    case 'SAVE_SCORES':
      return {
        ...state,
        scores: action.payload
      };
    case 'SAVE_GAMES':
      return {
        ...state,
        games: action.payload
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        chat: action.payload.data
      };

    default:
      return state;
  }
};
