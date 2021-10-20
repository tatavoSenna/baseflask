import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { connectDocusign } from '~/states/modules/integrations'

import styles from './index.module.scss'

const { Text } = Typography

function Head({ handleCollapsed, isCollapsed, isWeb }) {
	const { name: username, signatures_provider } = useSelector(
		({ session }) => session
	)
	const dispatch = useDispatch()

	const handleLogout = async () => {
		await Auth.signOut()
		Hub.dispatch(UI_AUTH_CHANNEL, {
			event: AUTH_STATE_CHANGE_EVENT,
			message: AuthState.SignedOut,
			data: null,
		})
	}
	const checkDocusign = () => {
		dispatch(connectDocusign())
	}

	function getMenu() {
		return (
			<Menu style={{ zIndex: 1 }}>
				{signatures_provider === 'docusign' ? (
					<Menu.Item key="docusign" onClick={checkDocusign}>
						Docusign connect
					</Menu.Item>
				) : null}
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
										{username ? username.substring(0, 1) : null}
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
