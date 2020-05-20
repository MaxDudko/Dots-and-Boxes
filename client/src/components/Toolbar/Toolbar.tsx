import React from 'react';
import styles from './Toolbar.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { IoMdExit, IoMdNotificationsOutline } from 'react-icons/io';
import Scores from '../Scores/Scores';
import Settings from '../Settings/Settings';
import { ReduxState } from '../../store/reducers';
import {
  CHANGE_COLOR,
  CHANGE_NAME, CHANGE_SIZE,
  IS_VICTORY,
  NEXT_MOVE,
  RESTART_GAME,
  SET_BOXES,
  SET_COORDS, SET_MESSAGES,
  SET_ROLE, SET_SESSION_ID, UPDATE_DATA
} from '../../store/actions';
import Chat from '../Chat/Chat';


interface Props {
  socket: SocketIOClient.Socket;
  id: string;
  session_id: string;
  x: number;
  y: number;
  isGameStart: boolean;
  firstPlayerName: string;
  secondPlayerName: string;
  firstPlayerColor: string;
  secondPlayerColor: string;
  firstPlayerBoxes: number;
  secondPlayerBoxes: number;
  allBoxes: number;
  playerWin: string;
  RESTART_GAME: Function;
  authController: Function;
  CHANGE_NAME: Function;
  CHANGE_COLOR: Function;
  SET_BOXES: Function;
  NEXT_MOVE: Function;
  username: string;
  color: string;
  SET_COORDS: Function;
  SET_ROLE: Function;
  IS_VICTORY: Function;
  UPDATE_DATA: Function;
  scores: number;
  chat: {[key: string]: string}[];
  CHANGE_SIZE: Function;
  SET_SESSION_ID: Function;
  SET_MESSAGES: Function;
}

const Toolbar: React.FC<Props> = (props) => {
  const [modal, selectModal] = React.useState('');
  const modalList: {[index: string]: any} = {
    settings: <Settings />,
    chat: <Chat />,
    scores: <Scores />,
    exit: ''
  };

  return(
    <div className={styles.Toolbar}>
      <Container>
        <Row className={styles.title}>
          <Col>
            Dots and Boxes
          </Col>
        </Row>

        <div className={styles.topNavbar}>
          <span style={{fontSize: "20px"}}>
            {`Hello ${props.username}`}
          </span>
          <span
            onClick={(): void => props.authController('', null)}
          >
            <IoMdExit />
          </span>
        </div>

        <Row>
          {
            props.isGameStart ?
                null
                :
                <Col sm="6">
                  <Button
                      variant="dark"
                      size="lg"
                      onClick={(): void => modal === 'settings' ? selectModal('exit') : selectModal('settings')}
                  >
                    Settings
                  </Button>
                </Col>
          }
          {
            props.isGameStart ?
                <Col sm="6">
                  <Button
                      variant="dark"
                      size="lg"
                      onClick={(): void => modal === 'chat' ? selectModal('exit') : selectModal('chat')}
                  >
                    Chat
                  </Button>
                  {
                    props.chat.length !== 0 ?
                        <span style={{ position: 'absolute', top: '5px', right: '40%' }}>
                    <IoMdNotificationsOutline />
                  </span>
                        :
                        null
                  }
                </Col>
                :
                null
          }
          <Col sm="6">
            <Button
              variant="dark"
              size="lg"
              onClick={(): void => modal === 'scores' ? selectModal('exit') : selectModal('scores')}
            >
              Scores
            </Button>
          </Col>
        </Row>

        <Row className={styles.modal}>
          <Col style={{ height: '100%' }}>
            {
                            modalList[modal]
                            ||
                            <div style={{ width: '100%' }}>
                                {
                                    props.playerWin ?
                                      <div
                                        className={styles.title}
                                        style={{
                                          color: props.playerWin === "No Winner" ?  "inherit" : props.playerWin === props.firstPlayerName ? props.firstPlayerColor : props.secondPlayerColor
                                        }}
                                      >
                                        {
                                                props.playerWin
                                            }
                                      </div>
                                      :
                                      null
                                }
                            </div>
                        }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default connect((state: ReduxState) => {
  return {
    x: state.game.x,
    y: state.game.y,
    socket: state.user.socket,
    id: state.user.id,
    session_id: state.game.session_id,
    isGameStart: state.game.isGameStart,
    firstPlayerName: state.user.firstPlayerName,
    secondPlayerName: state.user.secondPlayerName,
    firstPlayerColor: state.user.firstPlayerColor,
    secondPlayerColor: state.user.secondPlayerColor,
    firstPlayerBoxes: state.game.firstPlayerBoxes,
    secondPlayerBoxes: state.game.secondPlayerBoxes,
    allBoxes: state.game.allBoxes,
    playerWin: state.game.playerWin,
    username: state.user.username,
    color: state.user.color,
    scores: state.user.scores,
    chat: state.game.chat,
  };
}, (dispatch) => {
  return {
    RESTART_GAME: (): { type: string } => dispatch(RESTART_GAME()),
    CHANGE_NAME: (key: string, val: string): { type: string; payload: { key: string; val: string } } => dispatch(CHANGE_NAME(key, val)),
    CHANGE_COLOR: (key: string, val: string): { type: string; payload: { key: string; val: string } } => dispatch(CHANGE_COLOR(key, val)),
    SET_BOXES: (key: string, val: number): { payload: { val: number; key: string }; type: string } => dispatch(SET_BOXES(key, val)),
    NEXT_MOVE: (val: string): { payload: { val: string }; type: string } => dispatch(NEXT_MOVE(val)),
    SET_COORDS: (coords: string, history: string): { payload: { history: string; coords: string }; type: string } => dispatch(SET_COORDS(coords, history)),
    SET_ROLE: (val: string): { type: string; payload: { val: string } } => dispatch(SET_ROLE(val)),
    IS_VICTORY: (name: string): { payload: { name: string }; type: string } => dispatch(IS_VICTORY(name)),
    UPDATE_DATA: (data: {[key: string]: string}, id: string): { type: string; payload: { data: { [p: string]: string }; id: string; path: string; typed: string } } => dispatch(UPDATE_DATA(data, id)),
    CHANGE_SIZE: (key: string, val: number): { payload: { val: number; key: string }; type: string } => dispatch(CHANGE_SIZE(key, val)),
    SET_SESSION_ID: (val: string): { payload: { val: string }; type: string } => dispatch(SET_SESSION_ID(val)),
    SET_MESSAGES: (data: {[key: string]: string}): { payload: { data: { [p: string]: string } }; type: string } => dispatch(SET_MESSAGES(data)),
  };
})(Toolbar);