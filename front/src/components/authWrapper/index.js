import React, { useEffect } from 'react'
import { node } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Hub } from 'aws-amplify'
import { Authenticator, View, Image, useTheme } from '@aws-amplify/ui-react'
import LogOutContext from '~/context/LogOutContext'
import { clearSession } from 'states/modules/session'

import '@aws-amplify/ui-react/styles.css'
import styles from './index.module.scss'
import logo from '~/assets/logo.svg'

const components = {
	Header() {
		const { tokens } = useTheme()

		return (
			<View
				textAlign="center"
				padding={`${tokens.space.large} ${tokens.space.xxl} ${tokens.space.xs} ${tokens.space.xxl}`}>
				<Image alt="Lawing logo" src={logo} />
			</View>
		)
	},
}

function AuthWrapper({ children }) {
	const dispatch = useDispatch()
	const history = useHistory()
	useEffect(() => {
		Hub.listen('auth', (data) => {
			if (data.payload.event === 'signIn') {
				dispatch(clearSession())
				history.push('/')
			}
		})
	}, [dispatch, history])

	return (
		<Authenticator
			className={
				process.env.REACT_APP_SIGNUP_ON === 'true'
					? ''
					: styles['amplify-nosignup']
			}
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
