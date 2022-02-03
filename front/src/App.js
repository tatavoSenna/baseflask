import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Amplify, { I18n } from 'aws-amplify'
import { translations } from '@aws-amplify/ui'

import { store, persistor } from './states/store'
import Routes from './App.routes'
import GlobalStyle from './styles/global'

Amplify.configure({
	Auth: {
		region: process.env.REACT_APP_AWS_REGION,
		userPoolId: process.env.REACT_APP_AWS_USER_POOL,
		userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
		identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
	},
})

I18n.putVocabularies(translations)
I18n.putVocabularies({
	pt: {
		Email: 'Email',
		Name: 'Nome',
		'Email or Phone Number': 'Email ou número de telefone',
		'We Emailed You': 'Confirmação de email',
		'We Sent A Code': 'Confirmação de email',
		Confirm: 'Confirmar',

		'Invalid verification code provided, please try again.':
			'Código de verificação inválido. Por favor tente novamente.',

		'Your code is on the way. To log in, enter the code we sent you. It may take a minute to arrive.':
			'Seu código está a caminho. Para fazer o login, digite o código que enviamos a você. Pode demorar um minuto para chegar.',
	},
})

const App = () => {
	return (
		<Provider store={store}>
			<DndProvider backend={HTML5Backend}>
				<PersistGate persistor={persistor}>
					<GlobalStyle />
					<Routes />
				</PersistGate>
			</DndProvider>
		</Provider>
	)
}

export default App
