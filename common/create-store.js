import 'rxjs'; //

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Rx libs
import { Observable } from 'rxjs/Observable';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';

import reducer from './redux.js';


export default function createAppStore(devTools = (f => f), deps) {
  const middleware = applyMiddleware(
    thunk.withExtraArgument(deps),
    createEpicMiddleware(
      (actions, store) => rootEpic(actions, store, deps)
    )
  );

  const storeEnhancer = compose(
    middleware,
    devTools
  );

  return createStore(
    reducer,
    storeEnhancer
  );
}
