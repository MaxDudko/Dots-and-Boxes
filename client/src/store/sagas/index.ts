import { all, takeEvery } from 'redux-saga/effects';
import { getData } from './getData';
import { updateData } from './updateData';

export default function* rootSaga() {
  yield all([
    yield takeEvery('UPDATE_DATA', updateData),
    yield takeEvery('GET_GAMES', getData),
    yield takeEvery('GET_SCORES', getData),
  ]);
}
