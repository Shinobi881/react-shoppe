import { combineEpics } from 'redux-observable';
import * as api from './api.js';
import {
  types,
  fetchProductsComplete,
  fetchProductsError,
  autoLoginNouser,
  updateUserComplete,
  updateUserError
} from './redux';

function productsEpic(actions) {
  return actions.ofType(types.FETCH_PRODUCTS)
    .switchMap(() => {
      return api.getProducts()
        .map(products => fetchProductsComplete(products))
        .catch(err => [fetchProductsError(err)]);
    })
}

export function autoLoginEpic(actions, { getState }, { storage }) {
  return actions.ofType(types.AUTO_LOGIN )
    .switchMap(() => {
      if (!storage.userId || !storage.token) {
        return autoLoginNoUser();
      }
      return api.fetchUser(storage.userId, storage.token)
        .map(user => updateUserComplete(user))
        .catch(err => updateUserError(err));
    });
};


export default combineEpics(productsEpic, autoLoginEpic);
