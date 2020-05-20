import SocketIOClient from "socket.io-client";
import {Action, AnyAction} from "redux";
export interface User {
  id: string;
  socket: SocketIOClient.Socket|any;
  username: string;
  color: string;
  role: string;
  firstPlayerName: string;
  secondPlayerName: string;
  firstPlayerColor: string;
  secondPlayerColor: string;
  scores: number;
  // [key: string]: any;
}

export const initialState = {
  id: '',
  socket: "",
  username: '',
  color: '',
  role: '',
  firstPlayerName: '',
  secondPlayerName: '',
  firstPlayerColor: '',
  secondPlayerColor: '',
  scores: 0,
};

export const user = (state: User = initialState, action: AnyAction): User => {
  switch (action.type) {
    case 'SET_ID':
      return {
        ...state,
        id: action.payload.id
      };
    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload.val
      };
    case 'SOCKET_CONNECT':
      return {
        ...state,
        socket: action.payload.socket
      };
    case 'CHANGE_NAME':
      return {
        ...state,
        [action.payload.key]: action.payload.val
      };

    case 'CHANGE_COLOR':
      return {
        ...state,
        [action.payload.key]: action.payload.val
      };
    case 'CHANGE_SCORES':
      return {
        ...state,
        scores: action.payload.val
      };

    default:
      return state;
  }
};
