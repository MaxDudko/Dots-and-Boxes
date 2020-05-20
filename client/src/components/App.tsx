import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import styles from './App.module.scss';
import Toolbar from './Toolbar/Toolbar';
import Board from './Board/Board';

import { ReduxState } from '../store/reducers';
import {
  calcL,
  CHANGE_COLOR,
  CHANGE_NAME,
  SET_COUNTER,
  SET_ID,
  SOCKET_CONNECT,
  IS_VICTORY,
  SET_MESSAGES, UPDATE_DATA, START_GAME
  , GET_SCORES, SET_SESSION_ID, SET_BOXES, NEXT_MOVE, SET_COORDS, CHANGE_SIZE } from '../store/actions';
import Auth from './Auth/Auth';

import { CHANGE_SCORES, SET_ROLE } from '../store/actions/user';
import { API } from '../constants';
import Menu from './Menu/Menu';
import { GET_GAMES } from '../store/actions/game';
import SocketIOClient from "socket.io-client";
import {StateInterface} from "../../../server/src/controllers/game";

interface Props {
  socket: SocketIOClient.Socket;
  id: string;
  isGameStart: boolean;
  x: number;
  y: number;
  username: string;
  role: string;
  scores: number;
  SET_ID: Function;
  SET_SESSION_ID: Function;
  SET_ROLE: Function;
  CHANGE_NAME: Function;
  CHANGE_COLOR: Function;
  CHANGE_SIZE: Function;
  SET_COUNTER: Function;
  SET_BOXES: Function;
  NEXT_MOVE: Function;
  SET_COORDS: Function;
  GET_GAMES: Function;
  GET_SCORES: Function;
  IS_VICTORY: Function;
  CHANGE_SCORES: Function;
  SET_MESSAGES: Function;
  UPDATE_DATA: Function;
  calcL: Function;
  SOCKET_CONNECT: Function;
  START_GAME: Function;
  firstPlayerName: string;
  secondPlayerName: string;
}

class App extends React.Component<Props> {
  state = {};

  componentDidMount(): void {
    const token = window.localStorage.getItem('token');
    if(!token) return;
    axios.get(`${API}/auth/get/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then((response) => {
        const id = response.data.user._id;
        const name = response.data.user.username;
        const { color } = response.data.user;
        const { scores } = response.data.user;
        this.props.SET_ID(id);
        this.props.CHANGE_NAME('username', name);
        this.props.CHANGE_COLOR('color', color);
        this.props.SET_COUNTER(this.props.x * this.props.y);
        this.props.CHANGE_SCORES(scores);
        this.props.GET_GAMES();
        this.props.GET_SCORES();

        const socket = socketIOClient('http://localhost:4000', {
          query: {
            token
          }
        });
        this.props.SOCKET_CONNECT(socket);

        socket.on('state', (gameState: StateInterface) => {
          const players = Object.keys(gameState.players);
          this.props.SET_SESSION_ID(gameState._id);
          if (players[0]) {
            this.props.CHANGE_NAME('firstPlayerName', gameState.players[0].username);
            this.props.CHANGE_COLOR('firstPlayerColor', gameState.players[0].color);
            this.props.SET_BOXES('firstPlayerBoxes', gameState.players[0].playerBoxes);
            if (!this.props.role && gameState.players[0].username === this.props.username) {
              this.props.SET_ROLE(gameState.players[0].role);
            }
          } else {
            this.props.CHANGE_NAME('firstPlayerName', '');
            this.props.CHANGE_COLOR('firstPlayerColor', '');
            this.props.SET_BOXES('firstPlayerBoxes', '');
          }
          this.props.NEXT_MOVE(gameState.board.nextMove);
          this.props.SET_COORDS(gameState.board.lineCoords, gameState.board.history);
          this.props.SET_MESSAGES(gameState.board.chat);
          if (players[1]) {
            this.props.CHANGE_NAME('secondPlayerName', gameState.players[1].username);
            this.props.CHANGE_COLOR('secondPlayerColor', gameState.players[1].color);
            this.props.SET_BOXES('secondPlayerBoxes', gameState.players[1].playerBoxes);
            if (!this.props.role && gameState.players[1].username === this.props.username) {
              this.props.SET_ROLE(gameState.players[1].role);
            }
          }

          if (this.props.x !== gameState.board.x) this.props.CHANGE_SIZE('x', gameState.board.x);
          if (this.props.y !== gameState.board.y) this.props.CHANGE_SIZE('y', gameState.board.y);

          if (gameState.board.winner) {
            this.props.IS_VICTORY(gameState.board.winner);

            if (gameState.board.winner === this.props.username) {
              this.props.UPDATE_DATA({ scores: +this.props.scores + 1 }, this.props.id);
            }
          }
          if (!this.props.isGameStart) this.props.START_GAME();
        });

      })
      .catch(() => {
        window.localStorage.clear();
      });
    // const val = 7 / 100 * document.body.clientWidth;
    // this.props.calcL(val);
    this.props.calcL(50);
  }

  authController(form: string, data: {[key: string]: string}): void {
    if(!form) {
      window.localStorage.clear();
      window.location.reload();
      return;
    }
    axios.post(`${API}/auth/${form}/`, {
      'user': {
        ...data
      }
    })
      .then((response) => {
        window.localStorage.setItem('token', response.data.user.token);
        window.location.reload();
      });
  }

  render(): JSX.Element {
    return(
      <div className={styles.App}>
        {
          window.localStorage.getItem('token') ?
              <div className={styles.wrapper}>
                <Toolbar authController={this.authController.bind(this)} />
                {
                  this.props.isGameStart ?
                      <Board />
                      :
                      <Menu />
                }
              </div>
              :
              <div className={styles.wrapper}>
                <Auth authController={this.authController.bind(this)} />
              </div>
        }
        <div className={styles.background}>
          {
            [...Array(20).keys()].map((e: number, n: number) => <span key={n} />)
          }
        </div>
      </div>
    );
  }
}

export default connect((state: ReduxState) => {
  return {
    socket: state.user.socket,
    id: state.user.id,
    isGameStart: state.game.isGameStart,
    x: state.game.x,
    y: state.game.y,
    username: state.user.username,
    role: state.user.role,
    scores: state.user.scores,
    firstPlayerName: state.user.firstPlayerName,
    secondPlayerName: state.user.secondPlayerName,
  };
}, (dispatch) => {
  return {
    SET_ID: (id: string): { payload: { id: string }; type: string } => dispatch(SET_ID(id)),
    SET_SESSION_ID: (val: string): { type: string; payload: { val: string } } => dispatch(SET_SESSION_ID(val)),
    SET_ROLE: (val: string): {type: string; payload: {val: string}} => dispatch(SET_ROLE(val)),
    SOCKET_CONNECT: (socket: SocketIOClient.Socket): { type: string; payload: { socket: SocketIOClient.Socket } } => dispatch(SOCKET_CONNECT(socket)),
    CHANGE_NAME: (key: string, val: string): { payload: { val: string; key: string }; type: string } => dispatch(CHANGE_NAME(key, val)),
    CHANGE_COLOR: (key: string, val: string): { payload: { val: string; key: string }; type: string } => dispatch(CHANGE_COLOR(key, val)),
    CHANGE_SIZE: (key: string, val: number): {type: string; payload: {key: string; val: number}} => dispatch(CHANGE_SIZE(key, val)),
    calcL: (val: number): { payload: { val: number }; type: string } => dispatch(calcL(val)),
    SET_COUNTER: (val: number): { payload: { val: number }; type: string } => dispatch(SET_COUNTER(val)),
    SET_BOXES: (key: string, val: number): {type: string; payload: {key: string; val: number}} => dispatch(SET_BOXES(key, val)),
    NEXT_MOVE: (val: string): {type: string; payload: {val: string}} => dispatch(NEXT_MOVE(val)),
    SET_COORDS: (coords: string, history: string): {type: string; payload: {coords: string; history: string}} => dispatch(SET_COORDS(coords, history)),
    GET_GAMES: (): { payload: { path: string; typed: string }; type: string } => dispatch(GET_GAMES()),
    GET_SCORES: (): { payload: { path: string; typed: string }; type: string } => dispatch(GET_SCORES()),
    CHANGE_SCORES: (val: number): { payload: { val: number }; type: string } => dispatch(CHANGE_SCORES(val)),
    IS_VICTORY: (name: string): {type: string; payload: {name: string} } => dispatch(IS_VICTORY(name)),
    SET_MESSAGES: (data: {[key: string]: string}): {type: string; payload: {data: {[key: string]: string}}} => dispatch(SET_MESSAGES(data)),
    UPDATE_DATA: (data: {[key: string]: string}, id: string): { type: string; payload: { data: { [p: string]: string }; id: string; path: string; typed: string } } => dispatch(UPDATE_DATA(data, id)),
    START_GAME: (): { type: string } => dispatch(START_GAME()),
  };
})(App);


