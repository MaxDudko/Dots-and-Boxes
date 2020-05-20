import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import styles from './Settings.module.scss';
import { ReduxState } from '../../store/reducers';
import { CHANGE_COLOR, CHANGE_NAME, CHANGE_SIZE, SET_COUNTER, UPDATE_DATA } from '../../store/actions';

interface Props {
  socket: SocketIOClient.Socket;
  id: string;
  session_id: string;
  x: number;
  y: number;
  username: string;
  color: string;
  isGameStart: boolean;
  CHANGE_SIZE: Function;
  SET_COUNTER: Function;
  CHANGE_NAME: Function;
  CHANGE_COLOR: Function;
  UPDATE_DATA: Function;

  func?: Function;
  cancel?: Function;
  btn?: string;
}

const Settings: React.FC<Props> = (props) => {
  const [newX, setX] = React.useState<number | null>(null);
  const [newY, setY] = React.useState<number | null>(null);
  const [newName, setName] = React.useState<string | null>(null);
  const [newColor, setColor] = React.useState<string | null>(null);

  const updateSettings = (): void => {
    const { socket } = props;
    const updateData = (key: string, val: string): void => {
      props.UPDATE_DATA({
        username: newName || props.username,
        color: newColor || props.color
      }, props.id);
      socket.emit('updatePlayerState', {
        session_id: props.session_id,
        id: props.id,
        key,
        val
      });
    };
    const updateSize = (axis: string, value: number): void => {
      // props.CHANGE_SIZE(axis, value);
      socket.emit('updateBoardState', {
        session_id: props.session_id,
        key: axis,
        val: value
      });
    };

    newName && props.CHANGE_NAME('firstPlayerName', newName);
    newColor && props.CHANGE_COLOR('firstPlayerColor', newColor);
    newName && updateData('username', newName);
    newColor && updateData('color', newColor);
    newX && updateSize('x', newX);
    newY && updateSize('y', newY);
    (newX || newY) && props.SET_COUNTER((newX || props.x) * (newY || props.y));
    if (props.func) props.func("", newX || props.x, newY || props.y)
  };

  return(
    <div className={styles.Settings}>
      <Container>
        <Form>
          <Row>
            {
              props.cancel ?
                  [
                    <Col key={1}>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>X Size: </Form.Label>
                        <Form.Control
                            type="number"
                            min={3}
                            max={10}
                            defaultValue={props.x}
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => setX(+e.currentTarget.value)}
                        />
                      </Form.Group>
                    </Col>,
                    <Col key={2}>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Y Size: </Form.Label>
                        <Form.Control
                            type="number"
                            min={3}
                            max={10}
                            defaultValue={props.y}
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => setY(+e.currentTarget.value)}
                        />
                      </Form.Group>
                    </Col>
                  ]
                  :
                  [
                    <Col key={1}>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Name: </Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={props.username}
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => setName(e.currentTarget.value)}
                        />
                      </Form.Group>
                    </Col>,
                    <Col key={2}>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Color: </Form.Label>
                        <Form.Control
                            type="color"
                            defaultValue={props.color}
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => setColor(e.currentTarget.value)}
                        />
                      </Form.Group>
                    </Col>
                  ]
            }
          </Row>
          <Row>
            {
              props.cancel ?
                  <Col>
                    <Button
                        variant="dark"
                        onClick={(): void => props.cancel(false)}
                    >
                      Cancel
                    </Button>
                  </Col>
                  :
                  null
            }
            <Col>
              <Button
                variant={props.btn ? "danger" : "dark"}
                onClick={(): void => updateSettings()}
              >
                {props.btn ? props.btn : "Update"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default connect((state: ReduxState) => {
  return {
    socket: state.user.socket,
    id: state.user.id,
    session_id: state.game.session_id,
    x: state.game.x,
    y: state.game.y,
    username: state.user.username,
    color: state.user.color,
    isGameStart: state.game.isGameStart,
  };
}, (dispatch) => {
  return {
    CHANGE_SIZE: (key: string, val: number): { payload: { val: number; key: string }; type: string } => dispatch(CHANGE_SIZE(key, val)),
    SET_COUNTER: (val: number): { payload: { val: number }; type: string } => dispatch(SET_COUNTER(val)),
    CHANGE_NAME: (key: string, val: string): { payload: { val: string; key: string }; type: string } => dispatch(CHANGE_NAME(key, val)),
    CHANGE_COLOR: (key: string, val: string): { payload: { val: string; key: string }; type: string } => dispatch(CHANGE_COLOR(key, val)),
    UPDATE_DATA: (data: {[key: string]: string}, id: string): { payload: { path: string; typed: string; data: {[key: string]: string}; id: string }; type: string } => dispatch(UPDATE_DATA(data, id)),
  };
})(Settings);