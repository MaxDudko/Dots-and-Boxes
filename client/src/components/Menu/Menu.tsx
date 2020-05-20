import React from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { IoLogoGameControllerB } from 'react-icons/io';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AiOutlineReload } from 'react-icons/all';
import { ReduxState } from '../../store/reducers';
import styles from './Menu.module.scss';
import { GET_GAMES } from '../../store/actions/game';
import Settings from "../Settings/Settings";

// interface GameData {
//   _id: string;
//   firstPlayer: [string, string, number, boolean];
//   secondPlayer: [string, string, number, boolean];
// }

interface Props {
  socket: SocketIOClient.Socket;
  id: string;
  username: string;
  color: string;
  x: number;
  y: number;
  games: {[key: string]: string}[];
  GET_GAMES: Function;
}

const Menu: React.FC<Props> = (props) => {
  const [isFree, setView] = React.useState(true);
  const [isSettings, change] = React.useState(false);
  const [cursor, setCursor] = React.useState([]);

  const connect = (_id: string, x: number, y: number): void => {
    const { socket } = props;

    const playerData = {
      session_id: _id,
      id: props.id,
      username: props.username,
      color: props.color,
        x: x,
        y: y,
    };

    socket.emit('newPlayer', playerData);

  };
  const renderList = (): JSX.Element[] => {
    const list: JSX.Element[] = [];
    props.games.map((game: any, i: number) => {
      list.push(
        <tr
          key={i}
          hidden={
                        isFree
                        &&
                        !(
                          game.firstPlayer[0] === props.username || game.secondPlayer[0] === props.username
                            ||
                            game.firstPlayer[0] === undefined || game.secondPlayer[0] === undefined
                        )
                    }
        >
          <td>{i + 1}</td>
          <td style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <span style={{ color: game.firstPlayer[1] }}>
              {
                                game.firstPlayer[0] || '―'
                            }
            </span>
            <span style={{ color: game.secondPlayer[1] }}>
              {
                                game.secondPlayer[0] || '―'
                            }
            </span>
          </td>
          <td style={{ textAlign: 'center' }}>{ game.firstPlayer[2] || '―'}   /   {game.secondPlayer[2] || '―'}</td>
          <td style={{ textAlign: 'center' }}>
            <Button
              variant={
                            (game.firstPlayer[0] === props.username || game.secondPlayer[0] === props.username
                                ||
                                game.firstPlayer[0] === undefined || game.secondPlayer[0] === undefined) ? 'success': 'warning'
}
              title={
                                    (game.firstPlayer[0] === props.username || game.secondPlayer[0] === props.username
                                        ||
                                        game.firstPlayer[0] === undefined || game.secondPlayer[0] === undefined)
                                      ? `Connect to: ${game._id}` : `can't connect to: ${game._id}`
}
              disabled={
                                    !(game.firstPlayer[0] === props.username || game.secondPlayer[0] === props.username
                                    ||
                                    game.firstPlayer[0] === undefined || game.secondPlayer[0] === undefined)
                                }
              onClick={(): void => connect(game._id, props.x, props.y)}
            >
              {
                                game.firstPlayer.length === 0 || game.secondPlayer.length === 0 ?
                                  'Connect'
                                  :
                                  'Connect'
                            }
            </Button>
          </td>
        </tr>
      );

    });

    return list;
  };

  return(
    <div className={styles.Menu}>
      <Container>
                  <Row className={styles.menu}>
                      <Col sm="12" md="4">
                          <Button
                              variant="dark"
                              size="lg"
                              onClick={(): void => setView(!isFree)}
                          >
                              View Free
                          </Button>
                      </Col>
                      <Col sm="12" md="4">
                          <Button
                              variant="dark"
                              size="lg"
                              onClick={(): void => setView(!isFree)}
                          >
                              View All
                          </Button>
                      </Col>
                      <Col sm="12" md="4">
                          <Button
                              variant="danger"
                              size="lg"
                              onClick={(e: React.MouseEvent): void => {
                                  setCursor([e.clientX, e.clientY])
                                  change(true)
                              }}
                          >
                              Create NEW
                          </Button>
                      </Col>
                  </Row>
          {
              isSettings ?
                  <div style={{
                      position: "absolute",
                      width: "400px",
                      left: cursor[0]-200
                  }}>
                      <Settings func={connect} cancel={change} btn="Start Game"/>
                  </div>
                  :
                  null
          }
        <div className={styles.table}>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Players</th>
                <th>Scores</th>
                <th style={{ fontSize: '25px' }}>
                  <IoLogoGameControllerB />
                  <span
                    style={{
                        position: 'relative',
                        left: '40%',
                        cursor: 'pointer'
                      }}
                    onClick={(): void => props.GET_GAMES()}
                  >
                    <AiOutlineReload />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {
                            renderList()
                        }
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default connect((state: ReduxState) => {
  return {
    socket: state.user.socket,
    id: state.user.id,
    username: state.user.username,
    color: state.user.color,
      x: state.game.x,
      y: state.game.y,
    games: state.game.games,
  };
}, (dispatch) => {
  return {
    GET_GAMES: (): { type: string; payload: { path: string; typed: string } } => dispatch(GET_GAMES())
  };
})(Menu);