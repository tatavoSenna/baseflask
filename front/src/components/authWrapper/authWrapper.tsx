import React from 'react'
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react'

interface Props {
	children: React.ReactNode
}

function AuthWrapper({ children }: Props) {
	return (
		<AmplifyAuthenticator>
			<AmplifySignIn slot="sign-in" hideSignUp={true} />
			{children}
		</AmplifyAuthenticator>
	)
}

export default AuthWrapper
