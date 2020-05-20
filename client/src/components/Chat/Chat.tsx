import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { ReduxState } from '../../store/reducers';
import styles from './Chat.module.scss';


interface Props {
  session_id: string;
  socket: SocketIOClient.Socket;
  firstPlayerColor: string;
  secondPlayerColor: string;
  firstPlayerName: string;
  secondPlayerName: string;
  chat: {[key: string]: string}[];
  role: string;
}

const Chat: React.FC<Props> = (props) => {
  const [message, setMessage] = React.useState('');
  const output = React.useRef(null);

  return(
    <div className={styles.Chat}>
      <Container>
        <Row>
          <Col className={styles.console} sm={6} md={6}>
            <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control
                  as="textarea"
rows="2"
                  style={{
                    background: 'transparent',
                    color: props.role === 'firstPlayer' ? props.firstPlayerColor : props.secondPlayerColor
                  }}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setMessage(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="dark"
                size="lg"
                onClick={(): void => {
                  const data: {[key: string]: string} = {
                    session_id: props.session_id,
                    from: props.role === 'firstPlayer' ? props.firstPlayerName : props.secondPlayerName,
                    message
                  };
                  props.socket.emit('sendMessage', data);

                  setMessage('');
                }}
              >
                Send
              </Button>
            </Form>
          </Col>
          <Col className={styles.output} sm={6} md={6} ref={output}>
            {
                            props.chat.map((e: {[key: string]: string}, n: number) => {
                              return(
                                <span
                                  key={n}
                                  style={{
                                    color: e.from === props.firstPlayerName ? props.firstPlayerColor : props.secondPlayerColor,
                                    padding: '5px 25px',
                                    background: 'rgba(0,0,0,.5)',
                                    borderRadius: '15px',
                                  }}
                                >
                                  {e.message}
                                </span>
                              );
                            })
                        }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default connect((state: ReduxState) => {
  return {
    session_id: state.game.session_id,
    socket: state.user.socket,
    firstPlayerColor: state.user.firstPlayerColor,
    secondPlayerColor: state.user.secondPlayerColor,
    firstPlayerName: state.user.firstPlayerName,
    secondPlayerName: state.user.secondPlayerName,
    chat: state.game.chat,
    role: state.user.role,
  };
})(Chat);