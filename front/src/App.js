import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor } from './states/store'
import Routes from './App.routes'
import GlobalStyle from './styles/global'

const App = () => (
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<GlobalStyle />
			<Routes />
		</PersistGate>
	</Provider>
)

export default App
