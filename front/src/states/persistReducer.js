import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistReducers = (reducers) => {
	const persistedReducer = persistReducer(
		{
			key: 'root',
			storage,
			whitelist: ['session'],
		},
		reducers
	)

	return persistedReducer
}

export default persistReducers
