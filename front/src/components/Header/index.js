import React from 'react'
import { func, bool } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, Typography, Space, Badge } from 'antd'
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	DownOutlined,
	BellOutlined,
	MessageOutlined,
} from '@ant-design/icons'

import { logout } from '~/states/modules/session'
import { classNames } from '~/utils'

import styles from './index.module.scss'

const { Text } = Typography

function Head({ handleCollapsed, isCollapsed, isWeb }) {
	const history = useHistory()
	const dispatch = useDispatch()

	const { loggedUser } = useSelector(({ session }) => session)

	const handleLogout = () => {
		dispatch(logout({ history }))
	}

	function getMenu() {
		return (
			<Menu style={{ zIndex: 1 }}>
				<Menu.Item
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
				<Menu.Item onClick={handleLogout}>Sair</Menu.Item>
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
					<div style={{ paddingTop: 12 }}>
						<Space size={28}>
							<Badge count={2}>
								<MessageOutlined style={{ fontSize: '20px' }} />
							</Badge>
							<Badge count={2}>
								<BellOutlined style={{ fontSize: '20px' }} />
							</Badge>
						</Space>
					</div>
					<Space size={12}>
						<Dropdown overlay={() => getMenu()}>
							<Space size={10}>
								<Avatar>
									<Text style={{ color: '#333' }}>
										{(loggedUser && loggedUser.name
											? loggedUser.name.substring(0, 1)
											: '') +
											(loggedUser && loggedUser.surname
												? loggedUser.surname.substring(0, 1)
												: '')}
									</Text>
								</Avatar>
								<Text style={{ color: '#333' }}>
									{loggedUser && loggedUser.name
										? `${loggedUser.name} ${loggedUser.surname}`
										: ''}
								</Text>
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
