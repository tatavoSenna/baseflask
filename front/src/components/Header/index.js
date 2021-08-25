import React from 'react'
import { useSelector } from 'react-redux'
import { func, bool } from 'prop-types'
import {
	UI_AUTH_CHANNEL,
	AUTH_STATE_CHANGE_EVENT,
	AuthState,
} from '@aws-amplify/ui-components'
import { Auth, Hub } from 'aws-amplify'
import {
	Layout,
	Menu,
	Dropdown,
	Avatar,
	Typography,
	Space /*, Badge*/,
} from 'antd'
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	DownOutlined,
} from '@ant-design/icons'

import { classNames } from '~/utils'

import styles from './index.module.scss'

const { Text } = Typography

function Head({ handleCollapsed, isCollapsed, isWeb }) {
	const username = useSelector(({ session }) => session.name)

	const handleLogout = async () => {
		await Auth.signOut()
		Hub.dispatch(UI_AUTH_CHANNEL, {
			event: AUTH_STATE_CHANGE_EVENT,
			message: AuthState.SignedOut,
			data: null,
		})
	}

	function getMenu() {
		return (
			<Menu style={{ zIndex: 1 }}>
				<Menu.Item
					key="docusign"
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
				</Menu.Item>
				<Menu.Item key="logout" onClick={handleLogout}>
					Sair
				</Menu.Item>
			</Menu>
		)
	}

	const { Header } = Layout
	return (
		<Header
			style={{ opacity: !isWeb && !isCollapsed ? 0.5 : 1 }}
			className={classNames(styles.siteLayout, { [styles.mobile]: !isWeb })}>
			{isWeb ? (
				React.createElement(
					isCollapsed ? ArrowRightOutlined : ArrowLeftOutlined,
					{
						className: styles.trigger,
						onClick: () => handleCollapsed(),
					}
				)
			) : (
				<div />
			)}
			<div
				className={classNames(styles.profile, {
					[styles.profileMobile]: !isWeb,
				})}>
				<Space size={48}>
					<Space size={12}>
						<Dropdown overlay={() => getMenu()}>
							<Space size={10}>
								<Avatar>
									<Text style={{ color: '#333' }}>
										{username.substring(0, 1)}
									</Text>
								</Avatar>
								<Text style={{ color: '#333' }}>{username}</Text>
								<DownOutlined />
							</Space>
						</Dropdown>
					</Space>
				</Space>
			</div>
		</Header>
	)
}

Head.propTypes = {
	handleCollapsed: func.isRequired,
	isCollapsed: bool.isRequired,
	isWeb: bool,
}

Head.deafultProps = {
	isWeb: true,
}

export default Head
