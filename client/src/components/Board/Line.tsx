import React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from '../../store/reducers';
import { SET_COORDS } from '../../store/actions';

interface Props {
  socket: SocketIOClient.Socket;
  session_id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  l: number;
  color: string;
  firstPlayerName: string;
  nextMove: string;
  firstPlayerColor: string;
  secondPlayerColor: string;
  SET_COORDS: Function;
  lineCoords: string[];
  history: string[];
  role: string;
  [key: string]: string|number|string[]|Function|SocketIOClient.Socket;
}

const Line: React.FC<Props> = (props) => {
  const [isHover, hover] = React.useState(false);
  const [isSelect, select] = React.useState(false);
  const [color, setColor] = React.useState('transparent');
  const { l } = props;

  React.useEffect(() => {
    const coords = `${props.x1},${props.y1} ${props.x2},${props.y2}`;
    if (props.lineCoords.includes(coords)) {
      select(true);
      const n = props.lineCoords.indexOf(coords);
      setColor(props.history[n] === props.firstPlayerName ? props.firstPlayerColor : props.secondPlayerColor);
    }
  }, [props.lineCoords]);

  const strokeColor = (): string => {
    if (!isSelect) {
      const current = props.nextMove === props.firstPlayerName ? props.secondPlayerName : props.firstPlayerName;
      if (isHover && props[`${props.role}Name`] === current) {

        if (props.nextMove === props.firstPlayerName) {
          return props.secondPlayerColor;
        } 
        return props.firstPlayerColor;
                
      } 
      return  'transparent';
            
    } 

    return color;
        
  };

  return(
    <line
      x1={props.x1}
      y1={props.y1}
      x2={props.x2}
      y2={props.y2}
      stroke={strokeColor()}
      strokeOpacity={isSelect ? 1 : .5}
      strokeWidth={isSelect ? l/5 : l/5}
      strokeLinecap="round"
      onMouseEnter={(): void => hover(!isHover)}
      onMouseLeave={(): void => hover(!isHover)}
      onClick={(): void => {
        const current = props.nextMove === props.firstPlayerName ? props.secondPlayerName : props.firstPlayerName;
        if (!isSelect && props[`${props.role}Name`] === current) {
          select(true);
          props.socket.emit('nextMove', {
            session_id: props.session_id,
            coords: `${props.x1},${props.y1} ${props.x2},${props.y2}`
          });

        }
      }}
    />
  );
};

export default connect((state: ReduxState) => {
  return {
    socket: state.user.socket,
    session_id: state.game.session_id,
    l: state.game.l,
    firstPlayerName: state.user.firstPlayerName,
    nextMove: state.game.nextMove,
    firstPlayerColor: state.user.firstPlayerColor,
    secondPlayerColor: state.user.secondPlayerColor,
    lineCoords: state.game.lineCoords,
    history: state.game.history,
    role: state.user.role,
  };
}, (dispatch) => {
  return {
    SET_COORDS: (coords: string, history: string): { payload: { history: string; coords: string }; type: string } => dispatch(SET_COORDS(coords, history))
  };
})(Line);