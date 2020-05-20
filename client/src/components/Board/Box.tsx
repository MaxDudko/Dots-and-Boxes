import React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from '../../store/reducers';
import { IS_VICTORY, UPDATE_DATA } from '../../store/actions';
import SocketIOClient from "socket.io-client";

interface Props {
  id: string;
  socket: SocketIOClient.Socket;
  scores: number;
  x: number;
  y: number;
  l: number;
  nextMove: string;
  firstPlayerColor: string;
  secondPlayerColor: string;
  lineCoords: string[];
  history: string[];
  IS_VICTORY: Function;
  firstPlayerName: string;
  secondPlayerName: string;
  firstPlayerBoxes: number;
  secondPlayerBoxes: number;
  allBoxes: number;
  playerWin: string;
  UPDATE_DATA: Function;
  role: string;
  session_id: string;
  [key: string]: string|number|string[]|Function|SocketIOClient.Socket;
}

const Box: React.FC<Props> = (props) => {
  const [isActive, activate] = React.useState(false);
  const [color, setColor] = React.useState('transparent');
  const { l } = props;
  const { socket } = props;

  // React.useEffect(() => {
  //   isFill()
  // }, [props.lineCoords]);

  const isFill = (): boolean => {
    const line1 = `${props.x},${props.y} ${props.x + l},${props.y}`;
    const line2 = `${props.x + l},${props.y} ${props.x + l},${props.y + l}`;
    const line3 = `${props.x},${props.y + l} ${props.x + l},${props.y + l}`;
    const line4 = `${props.x},${props.y} ${props.x},${props.y + l}`;

    const isAllLineSelected = (
      props.lineCoords.includes(line1)
            &&
            props.lineCoords.includes(line2)
            &&
            props.lineCoords.includes(line3)
            &&
            props.lineCoords.includes(line4)
    );
    if (!isActive && isAllLineSelected) {
      const lines: string[] = [line1, line2, line3, line4];
      const indexes: number[] = lines.map((line: string) => {
        return props.lineCoords.findIndex((l: string) => l === line );
      });
      const last = Math.max(...indexes);
      setColor(props.history[last] === props.firstPlayerName ? props.firstPlayerColor : props.secondPlayerColor);
      if (props.history[last] === props[`${props.role}Name`]) {
        socket.emit('count', { session_id: props.session_id, move: props.history[last] });
      }
      activate(true);
    }
    return isAllLineSelected;
  };

  return(
    <rect
      x={props.x}
      y={props.y}
      width={l}
      height={l}
      opacity={.5}
      fill={isFill() ? color : 'transparent'}
    />
  );
};

export default connect((state: ReduxState) => {
  return {
    id: state.user.id,
    socket: state.user.socket,
    l: state.game.l,
    nextMove: state.game.nextMove,
    firstPlayerColor: state.user.firstPlayerColor,
    secondPlayerColor: state.user.secondPlayerColor,
    lineCoords: state.game.lineCoords,
    history: state.game.history,
    firstPlayerName: state.user.firstPlayerName,
    secondPlayerName: state.user.secondPlayerName,
    firstPlayerBoxes: state.game.firstPlayerBoxes,
    secondPlayerBoxes: state.game.secondPlayerBoxes,
    allBoxes: state.game.allBoxes,
    playerWin: state.game.playerWin,
    scores: state.user.scores,
    role: state.user.role,
    session_id: state.game.session_id,
  };
}, (dispatch) => {
  return {
    IS_VICTORY: (name: string): { payload: { name: string }; type: string } => dispatch(IS_VICTORY(name)),
    UPDATE_DATA: (data: {[key: string]: string}, id: string): { payload: { path: string; typed: string; data: {[key: string]: string}; id: string }; type: string } => dispatch(UPDATE_DATA(data, id)),
  };
})(Box);