import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Amplify, { I18n } from 'aws-amplify'

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

I18n.setLanguage('pt-br')

const language_dict = {
	'pt-br': {
		'Sign In': 'Entrar',
		'Sign Up': 'Registrar-se',
		'Sign in to your account': 'Entre na sua conta Lawing',
		'Username *': 'Email *',
		'Password *': 'Senha *',
		'Forgot your password?': 'Esqueceu sua senha?',
		'Reset password': 'Recupere sua senha.',
		'No account?': 'Não tem conta?',
		'Create account': 'Crie sua conta.',
		'Enter your username': 'Digite seu email',
		'Enter your password': 'Digite sua senha',
	},
}

I18n.putVocabularies(language_dict)

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
