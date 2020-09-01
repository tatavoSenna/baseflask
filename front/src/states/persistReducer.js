import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { createFilter } from 'redux-persist-transform-filter'

export default (reducers) => {
	const persistedReducer = persistReducer(
		{
			key: 'lawing',
			storage,
			whitelist: ['session'],
			transforms: [createFilter('session', ['token', 'signed'])],
		},
		reducers
	)

	return persistedReducer
}
