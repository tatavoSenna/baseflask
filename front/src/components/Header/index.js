import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { func, bool, string } from 'prop-types'
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd'
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons'

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

	const handleExternalRedirect = () => {
		window.open(
			'https://www.youtube.com/channel/UCarjXS9zL3-xJqHI5JsidFw',
			'_blank'
		)
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
		<Header className={classNames(styles.siteLayout, className)}>
			<div
				className={classNames(styles.profile, {
					[styles.profileMobile]: !isWeb,
				})}>
				<div className={styles['iconsHeader']} onClick={handleExternalRedirect}>
					<QuestionCircleOutlined />
				</div>
				<Dropdown overlay={getMenu}>
					<div className={styles['dropDownProfile']}>
						<Avatar>
							<Text>{username ? username.substring(0, 1) : username}</Text>
						</Avatar>
						<Text>{username}</Text>
						<DownOutlined />
					</div>
				</Dropdown>
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
