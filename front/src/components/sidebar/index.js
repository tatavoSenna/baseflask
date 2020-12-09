import React, { useEffect } from 'react'
import { bool, func } from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import {
	FolderOpenOutlined,
	TeamOutlined,
	DeploymentUnitOutlined,
} from '@ant-design/icons'

import { listModel } from '~/states/modules/model'

import styles from './index.module.scss'
import logoBlack from '~/assets/logo-dark.svg'
import logo from '~/assets/logo.svg'
import logoSmall from '~/assets/logo-small.svg'

function SideBar({ collapsed, handleCollapsed, isWeb }) {
	const dispatch = useDispatch()
	const history = useHistory()
	const { pathname } = useLocation()

	useEffect(() => {
		dispatch(listModel())
	}, [dispatch])

	function handleGoTo(path) {
		if (!isWeb) {
			handleCollapsed()
		}
		return history.push(path)
	}

	const { Sider } = Layout
	return (
		<>
			{isWeb ? (
				<Sider trigger={null} collapsible collapsed={collapsed}>
					<div className={styles.logoWrapper}>
						{collapsed ? (
							<img
								src={logoSmall}
								alt="logo"
								className={styles.logoCollapsed}
							/>
						) : (
							<img src={logo} alt="logo" className={styles.logo} />
						)}
					</div>
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
						<Menu.Item
							key="/"
							onClick={() => handleGoTo('/')}
							icon={<FolderOpenOutlined />}>
							Contratos
						</Menu.Item>
						<Menu.Item
							key="users"
							icon={<TeamOutlined />}
							onClick={() => handleGoTo('/users')}>
							Usuários
						</Menu.Item>
						<Menu.Item
							key="integration"
							icon={<DeploymentUnitOutlined />}
							onClick={() => handleGoTo('/integrations')}>
							Integração
						</Menu.Item>
					</Menu>
				</Sider>
			) : (
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={handleCollapsed}
					collapsedWidth={0}
					defaultCollapsed={true}
					zeroWidthTriggerStyle={{
						top: '10px',
						color: '#fff',
						backgroundColor: '#001529',
					}}
					theme="light"
					className={styles.sidebar}>
					<div className={styles.logoWrapper}>
						<img src={logoBlack} alt="logo" className={styles.logo} />
					</div>
					<Menu
						defaultSelectedKeys={[`${pathname.split('/')[1] || '/'}`]}
						mode="inline">
						<Menu.Item
							key="/"
							onClick={() => handleGoTo('/')}
							icon={<FolderOpenOutlined />}>
							Contratos
						</Menu.Item>
						<Menu.Item
							key="users"
							icon={<TeamOutlined />}
							onClick={() => handleGoTo('/users')}>
							Usuários
						</Menu.Item>
						<Menu.Item
							key="integration"
							icon={<DeploymentUnitOutlined />}
							onClick={() => handleGoTo('/integrations')}>
							Integração
						</Menu.Item>
					</Menu>
				</Sider>
			)}
		</>
	)
}

SideBar.propTypes = {
	collapsed: bool.isRequired,
	handleCollapsed: func.isRequired,
	isWeb: bool,
}

SideBar.deafultProps = {
	isWeb: true,
}

export default SideBar
