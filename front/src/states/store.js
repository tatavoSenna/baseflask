import {
	configureStore,
	getDefaultMiddleware,
	combineReducers,
} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { persistStore } from 'redux-persist'

import persistReducers from './persistReducer'
import session, { sessionSaga } from './modules/session'
import contract, { contractSaga } from './modules/contract'
import question, { questionSaga } from './modules/question'
import answer, { answerSaga } from './modules/answer'

const sagaMiddleware = createSagaMiddleware()

const middleware = [
	...getDefaultMiddleware({ serializableCheck: false }),
	sagaMiddleware,
]

const reducers = combineReducers({
	session,
	contract,
	question,
	answer,
})

const store = configureStore({
	reducer: persistReducers(reducers),
	middleware,
})

const persistor = persistStore(store)

const rootSaga = function* () {
	yield all([sessionSaga(), contractSaga(), questionSaga(), answerSaga()])
}

sagaMiddleware.run(rootSaga)

export { persistor, store }
