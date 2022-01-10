import React from 'react'
import { node } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Hub } from 'aws-amplify'
import LogOutContext from '~/context/LogOutContext'

function AuthWrapper({ children }) {
	let history = useHistory()

	//TODO: register this listener only once
	Hub.listen('auth', (data) => {
		if (data.payload.event === 'signIn') {
			history.push('/')
		}
	})

	return (
		<Authenticator
			loginMechanisms={['email', 'phone_number']}
			signUpAttributes={['name', 'email', 'phone_number']}>
			{({ signOut, user }) => {
				return (
					<LogOutContext.Provider value={signOut}>
						{children}
					</LogOutContext.Provider>
				)
			}}
		</Authenticator>
	)
}

AuthWrapper.propTypes = {
	children: node.isRequired,
}

export default AuthWrapper
