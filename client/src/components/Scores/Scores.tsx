import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import {GiTrophyCup, MdKeyboardBackspace} from 'react-icons/all';
import { ReduxState } from '../../store/reducers';
import styles from './Scores.module.scss';

interface Scores {
  username: string;
  color: string;
  scores: number;
  history: {[key: string]: string|string[]|number[]}[];
}

interface Props {
  scores: Scores[];
}

const Scores: React.FC<Props> = (props) => {
  const [data] = React.useState(props.scores.sort((a: Scores, b: Scores) => b.scores - a.scores));
  const [list, change] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  const renderList = (): JSX.Element[] => {
    const list: JSX.Element[] = [];
        
    const tr = (n: number, name: string, color: string, scores: number): JSX.Element => {
      return(
        <tr style={{color: color, cursor: "pointer"}} key={n}
            onClick={(): void => {
              setIndex(n);
              change(false)
            }}
        >
          <td>
            <span>{n + 1}</span>
            { (n === 0) ? <GiTrophyCup style={{ color: '#ffd700' }} /> : null }
            { (n === 1) ? <GiTrophyCup style={{ color: '#c0c0c0' }} /> : null }
            { (n === 2) ? <GiTrophyCup style={{ color: '#cd7f32' }} /> : null }
          </td>
          <td>{name}</td>
          <td>{scores}</td>
        </tr>
      );
    };

    data.map((e: Scores, n: number) => {
      list.push(tr(n, e.username, e.color, e.scores));
    });

    return list;
  };

  const renderDetails = (index: number): JSX.Element[] => {
    const list: JSX.Element[] = [];

    data[index].history.map((e: any, n: number) => {
      list.push(
          <tr key={n}>
            <td>{e.date}</td>
            <td>
              <span style={{color: e.colors[0]}}>{e.players[0]}</span>
              vs
              <span style={{color: e.colors[1]}}> {e.players[1]}</span>
            </td>
            <td>
              <span style={{color: e.colors[0]}}>{e.score[0]}</span>
              x
              <span style={{color: e.colors[1]}}> {e.score[1]}</span>
            </td>
            <td style={{
              color: e.score[0] !== e.score[1] ?
                  e.score[0] > e.score[1] ? e.colors[0] : e.colors[1]
                  :
                  "inherit"
            }}>
              {
                e.score[0] !== e.score[1] ?
                    e.score[0] > e.score[1] ? e.players[0] + " Win!" : e.players[1] + " Win!"
                    :
                    "no Winner"
              }
            </td>
          </tr>
      )
    })

    return list;
  }

  return(
    <div className={styles.Scores}>
      <Container>
        {
          list ?
              <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Victories</th>
                </tr>
                </thead>
                <tbody>
                {
                  renderList()
                }
                </tbody>
              </Table>
              :
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th style={{
                        cursor: "pointer"
                    }}
                        onClick={(): void => change(true)}>
                      <MdKeyboardBackspace />
                    </th>
                  </tr>
                </thead>
                <tbody>
                {
                  renderDetails(index)
                }
                </tbody>
              </Table>
        }
      </Container>
      {/*<div style={{*/}
      {/*  width: "50px",*/}
      {/*  height: "100vh",*/}
      {/*  writingMode: "vertical-rl",*/}
      {/*  textOrientation: "mixed",*/}
      {/*}}> Exit </div>*/}
    </div>
  );
};

export default connect((state: ReduxState) => {
  return {
    scores: state.game.scores
  };
})(Scores);