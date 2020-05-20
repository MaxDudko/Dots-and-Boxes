import SocketIOClient from "socket.io-client";

export const SET_ID = (id: string): {type: string; payload: {id: string}} => {
  return {
    type: 'SET_ID',
    payload: {
      id
    }
  };
};

export const SET_ROLE = (val: string): {type: string; payload: {val: string}} => {
  return {
    type: 'SET_ROLE',
    payload: {
      val
    }
  };
};

export const SOCKET_CONNECT = (socket: SocketIOClient.Socket): {type: string; payload: {socket: SocketIOClient.Socket}} => {
  return {
    type: 'SOCKET_CONNECT',
    payload: {
      socket
    }
  };
};

export const CHANGE_NAME = (key: string, val: string): {type: string; payload: {key: string; val: string}} => {
  return {
    type: 'CHANGE_NAME',
    payload: {
      key,
      val
    }
  };
};

export const CHANGE_COLOR = (key: string, val: string): {type: string; payload: {key: string; val: string}} => {
  return {
    type: 'CHANGE_COLOR',
    payload: {
      key,
      val
    }
  };
};

export const UPDATE_DATA = (data: {[key: string]: string}, id: string): {
  type: string;
  payload: {
    data: {[key: string]: string};
    id: string;
    path: string;
    typed: string;
  };
} => {
  return {
    type: 'UPDATE_DATA',
    payload: {
      data,
      id,
      path: '/user/update/',
      typed: 'UPDATE_DATA'
    }
  };
};

export const CHANGE_SCORES = (val: number): {type: string; payload: {val: number}} => {
  return {
    type: 'CHANGE_SCORES',
    payload: {
      val,
    }
  };
};