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
import template, { templateSaga } from './modules/templates'
import postTemplate, { postTemplateSaga } from './modules/postTemplate'
import model, { modelSaga } from './modules/model'
import question, { questionSaga } from './modules/question'
import answer, { answerSaga } from './modules/answer'
import docusign, { docusignSaga } from './modules/docusign'
import users, { usersSaga } from './modules/users'
import groups, { groupsSaga } from './modules/groups'
import documentDetail, { documentDetailSaga } from './modules/documentDetail'
import integrations, { integrationsSaga } from './modules/integrations'
import settings, { settingsSaga } from './modules/settings'

const sagaMiddleware = createSagaMiddleware()

const middleware = [
	...getDefaultMiddleware({ serializableCheck: false }),
	sagaMiddleware,
]

const reducers = combineReducers({
	session,
	contract,
	template,
	postTemplate,
	model,
	question,
	answer,
	docusign,
	users,
	groups,
	documentDetail,
	integrations,
	settings,
})

const store = configureStore({
	reducer: persistReducers(reducers),
	middleware,
})

const persistor = persistStore(store)

const rootSaga = function* () {
	yield all([
		sessionSaga(),
		contractSaga(),
		templateSaga(),
		postTemplateSaga(),
		modelSaga(),
		questionSaga(),
		answerSaga(),
		docusignSaga(),
		usersSaga(),
		groupsSaga(),
		documentDetailSaga(),
		integrationsSaga(),
		settingsSaga(),
	])
}

sagaMiddleware.run(rootSaga)

export { persistor, store }
