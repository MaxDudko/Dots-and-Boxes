import axios from 'axios';
import { put } from 'redux-saga/effects';
import { API } from '../../constants';
import {AnyAction} from "redux";

export function* getData(action: AnyAction): Generator {
  let data;
  yield axios.post(`${API}${action.payload.path}`, {
    'id': action.payload.id
  })
    .then((response) => {
      data = response.data;
    });
  yield put({ type: action.payload.typed, payload: data });
}
