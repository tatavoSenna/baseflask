import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { func, bool, string } from 'prop-types'
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
import LogOutContext from '~/context/LogOutContext'

import styles from './index.module.scss'

const { Text } = Typography

function Head({ handleCollapsed, isCollapsed, isWeb, className }) {
	const { name: username, signatures_provider } = useSelector(
		({ session }) => session
	)
	const dispatch = useDispatch()
	const handleLogout = useContext(LogOutContext)

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
			style={{ display: 'flex', justifyContent: 'flex-end' }}
			className={classNames(styles.siteLayout, className)}>
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
										{username ? username.substring(0, 1) : username}
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
	className: string,
}

Head.deafultProps = {
	isWeb: true,
	className: '',
}

export default Head
