import axios from 'axios';
import { put } from 'redux-saga/effects';
import { API } from '../../constants';
import {AnyAction} from "redux";

export function* updateData(action: AnyAction): Generator {
  if(!action.payload.id) return;
  yield axios.post(`${API}${action.payload.path}`, {
    'user': {
      'id': action.payload.id,
      'data': {
        ...action.payload.data
      }
    }
  });
  yield put({ type: action.payload.typed, payload: action.payload });
}
