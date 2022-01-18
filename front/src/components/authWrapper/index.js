import React, { useEffect } from 'react'
import { node } from 'prop-types'
import { useHistory } from 'react-router-dom'

import { Hub } from 'aws-amplify'
import { Authenticator, View, Image, useTheme } from '@aws-amplify/ui-react'
import LogOutContext from '~/context/LogOutContext'

import '@aws-amplify/ui-react/styles.css'
import './index.module.scss'
import logo from '~/assets/logo.png'

const components = {
	Header() {
		const { tokens } = useTheme()

		return (
			<View
				textAlign="center"
				padding={`${tokens.space.large} 0 ${tokens.space.small} 0`}>
				<Image alt="Lawing logo" src={logo} />
			</View>
		)
	},
}

function AuthWrapper({ children }) {
	let history = useHistory()
	useEffect(() => {
		Hub.listen('auth', (data) => {
			if (data.payload.event === 'signIn') {
				history.push('/')
			}
		})
	}, [history])

	return (
		<Authenticator
			components={components}
			loginMechanisms={['email']}
			signUpAttributes={['name', 'email']}>
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
