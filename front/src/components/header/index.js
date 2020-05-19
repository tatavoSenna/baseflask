import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, Menu } from 'antd'

import { logout } from '~/states/modules/session'
import logo from '~/assets/logo.svg'

function Head() {
	const history = useHistory()
	const dispatch = useDispatch()

	const handleLogout = () => {
		dispatch(logout({ history }))
	}

	const { Item } = Menu
	return (
		<Layout.Header className="site-layout-background" style={styles.header}>
			<Menu
				mode="horizontal"
				defaultSelectedKeys={['2']}
				align="end"
				theme="dark">
				<Item style={styles.logoBox}>
					<img src={logo} alt="logo" style={{ width: '140px' }} />
				</Item>
				<Item
					key="setting:1"
					onClick={() => {
						window.location.assign(
							process.env.REACT_APP_DOCUSIGN_OAUTH_URL +
								'/auth?response_type=code&scope=signature&client_id=' +
								process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY +
								'&redirect_uri=' +
								process.env.REACT_APP_DOCUSIGN_REDIRECT_URL
						)
					}}>
					Docusign connect
				</Item>
				<Item key="setting:2" onClick={handleLogout}>
					Sair
				</Item>
			</Menu>
		</Layout.Header>
	)
}

const styles = {
	header: {
		padding: 0,
	},
}

export default Head
