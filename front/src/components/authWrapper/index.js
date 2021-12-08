import React from 'react'
import { node } from 'prop-types'
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react'

function AuthWrapper({ children }) {
	return (
		<AmplifyAuthenticator>
			<AmplifySignIn slot="sign-in" hideSignUp={true} />
			{children}
		</AmplifyAuthenticator>
	)
}

AuthWrapper.propTypes = {
	children: node.isRequired,
}

export default AuthWrapper
