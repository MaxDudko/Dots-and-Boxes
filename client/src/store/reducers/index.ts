import { combineReducers } from 'redux';

import { user, User } from './user';
import { game, Game } from './game';


export const reducers = combineReducers({
  user,
  game,
});

export interface ReduxState{
  user: User;
  game: Game;
}
