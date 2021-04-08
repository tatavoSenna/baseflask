import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { store, persistor } from './states/store'
import Routes from './App.routes'
import GlobalStyle from './styles/global'

const App = () => (
	<Provider store={store}>
		<DndProvider backend={HTML5Backend}>
			<PersistGate persistor={persistor}>
				<GlobalStyle />
				<Routes />
			</PersistGate>
		</DndProvider>
	</Provider>
)

export default App
