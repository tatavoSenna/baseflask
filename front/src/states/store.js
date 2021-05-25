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
import editTemplate, { editTemplateSaga } from './modules/editTemplate'
import model, { modelSaga } from './modules/model'
import question, { questionSaga } from './modules/question'
import externalContract, {
	externalContractSaga,
} from './modules/externalContract'
import answer, { answerSaga } from './modules/answer'
import docusign, { docusignSaga } from './modules/docusign'
import users, { usersSaga } from './modules/users'
import groups, { groupsSaga } from './modules/groups'
import documentDetail, { documentDetailSaga } from './modules/documentDetail'
import integrations, { integrationsSaga } from './modules/integrations'
import settings, { settingsSaga } from './modules/settings'
import stateField, { stateFieldSaga } from './modules/stateField'
import cnaeField, { cnaeFieldSaga } from './modules/cnaeField'
import cityField, { cityFieldSaga } from './modules/cityField'
import fileField, { fileFieldSaga } from './modules/fileField'

const sagaMiddleware = createSagaMiddleware()

const middleware = [
	...getDefaultMiddleware({ serializableCheck: false }),
	sagaMiddleware,
]

const reducers = combineReducers({
	session,
	contract,
	template,
	editTemplate,
	model,
	question,
	externalContract,
	answer,
	docusign,
	users,
	groups,
	documentDetail,
	integrations,
	settings,
	stateField,
	cnaeField,
	cityField,
	fileField,
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
		editTemplateSaga(),
		modelSaga(),
		questionSaga(),
		externalContractSaga(),
		answerSaga(),
		docusignSaga(),
		usersSaga(),
		groupsSaga(),
		documentDetailSaga(),
		integrationsSaga(),
		settingsSaga(),
		stateFieldSaga(),
		cnaeFieldSaga(),
		cityFieldSaga(),
		fileFieldSaga(),
	])
}

sagaMiddleware.run(rootSaga)

export { persistor, store }
