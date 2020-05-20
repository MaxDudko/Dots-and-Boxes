import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Box from './Box';
import { ReduxState } from '../../store/reducers';
import styles from './Board.module.scss';
import Line from './Line';

interface Props {
  x: number;
  y: number;
  l: number;
  firstPlayerName: string;
  secondPlayerName: string;
  firstPlayerColor: string;
  secondPlayerColor: string;
  firstPlayerBoxes: number;
  secondPlayerBoxes: number;
  nextMove: string;
  playerWin: string;
  lineCoords: string[];
}

const Board: React.FC<Props> = (props) => {
  const { l } = props;

  const renderDots = (): React.SVGProps<SVGCircleElement>[] => {
    const dots: React.SVGProps<SVGCircleElement>[] = [];
    let cx = l;
    let cy = l;

    for (let i = 0; i <= props.y; i++) {
      for (let j = 0; j <= props.x; j++) {
        dots.push(
          <circle
            cx={cx}
            cy={cy}
            r={l / 10}
            key={`dot ${cx} ${cy}`}
            fill="gray"
          />
        );
        cx += l;
      }
      cx = l;
      cy += l;
    }

    return dots;
  };

  const renderLines = (): JSX.Element[] => {
    const lines: JSX.Element[] = [];
    let cx = l;
    let cy = l;


    for (let i = 0; i <= props.y; i++) {
      for (let j = 0; j < props.x; j++) {
        lines.push(
          <Line
            x1={cx}
            y1={cy}
            x2={cx+l}
            y2={cy}
            color={props.nextMove === props.firstPlayerName ? props.secondPlayerColor : props.firstPlayerColor}
            key={`${cx} ${cy} ${cx+l} ${cy}`}
          />
        );
        cx += l;
      }
      cx = l;
      cy += l;
    }

    cx = l;
    cy = l;

    for (let i = 0; i < props.y; i++) {
      for (let j = 0; j <= props.x; j++) {
        lines.push(
          <Line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy+l}
            color={props.nextMove === props.firstPlayerName ? props.secondPlayerColor : props.firstPlayerColor}
            key={`${cx} ${cy+l} ${cx} ${cy}`}
          />
        );
        cx += l;
      }
      cx = l;
      cy += l;
    }

    return lines;
  };

  const renderRect = (): JSX.Element[] => {
    const rects: JSX.Element[] = [];
    let cx = l;
    let cy = l;

    for (let i = 0; i < props.y; i++) {
      for (let j = 0; j < props.x; j++) {
        rects.push(
          <Box
            x={cx}
            y={cy}
            key={`rect ${cx} ${cy}`}
          />
        );
        cx += l;
      }
      cx = l;
      cy += l;
    }

    return rects;
  };

  return(
    <div className={styles.Board}>
      <Container style={
                {
                  background: 'rgba(0, 0, 0, .5)',
                  borderRadius: '5px'
                }
            }
      >
        <Row>
          <Col
            sm={6}
            style={
                        {
                          color: props.firstPlayerColor,
                          padding: '5px 10px',
                          borderRadius: '100px',
                        }
                    }
          >
            <h4>
              <b>{props.firstPlayerName}</b>
              <span>{props.firstPlayerBoxes}</span>
            </h4>
          </Col>
          <Col
            sm={6}
            style={
                        {
                          color: props.secondPlayerColor,
                          padding: '5px 10px',
                          borderRadius: '100px',
                        }
                    }
          >
            <h4>
              <span>{props.secondPlayerBoxes}</span>
              <b>{props.secondPlayerName}</b>
            </h4>
          </Col>
          <Col sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width={(props.x+2)*(7 / 100 * document.body.clientWidth)} viewBox={`0 0 ${(props.x+2)*l} ${(props.y+2)*l}`} preserveAspectRatio="xMaxYMax meet">
              {
                                renderRect()
                            }
              {
                                renderLines()
                            }
              {
                                renderDots()
                            }
              {
                                props.firstPlayerName && props.secondPlayerName ?
                                  null
                                  :
                                  <rect
                                    width={(props.x+2)*l}
                                    height={(props.y+2)*l}
                                    fill="transparent"
                                  />
                            }
            </svg>
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
    l: state.game.l,
    firstPlayerName: state.user.firstPlayerName,
    secondPlayerName: state.user.secondPlayerName,
    firstPlayerColor: state.user.firstPlayerColor,
    secondPlayerColor: state.user.secondPlayerColor,
    firstPlayerBoxes: state.game.firstPlayerBoxes,
    secondPlayerBoxes: state.game.secondPlayerBoxes,
    nextMove: state.game.nextMove,
    playerWin: state.game.playerWin,
    lineCoords: state.game.lineCoords,
  };
})(Board);
