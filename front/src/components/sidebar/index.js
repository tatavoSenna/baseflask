import React from 'react'
import { bool, func } from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import {
	FileAddOutlined,
	FileTextOutlined,
	FolderOpenOutlined,
} from '@ant-design/icons'

import styles from './index.module.scss'
import logoBlack from '~/assets/logo-dark.svg'
import logo from '~/assets/logo.svg'

function SideBar({ collapsed, handleCollapsed, isWeb }) {
	const history = useHistory()
	const { pathname } = useLocation()

	function handleGoTo(path) {
		if (!isWeb) {
			handleCollapsed()
		}
		return history.push(path)
	}

	const { SubMenu } = Menu
	const { Sider } = Layout
	return (
		<>
			{isWeb ? (
				<Sider trigger={null} collapsible collapsed={collapsed}>
					<div className={styles.logoWrapper}>
						<img src={logo} alt="logo" className={styles.logo} />
					</div>
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
						<Menu.Item
							key="/"
							onClick={() => handleGoTo('/')}
							icon={<FolderOpenOutlined />}>
							Contratos
						</Menu.Item>
						<SubMenu
							key="sub1"
							icon={<FileAddOutlined />}
							title="Novo Contrato">
							<Menu.Item
								key="form"
								icon={<FileTextOutlined />}
								onClick={() => handleGoTo('/form/company')}>
								Mercado Livre
							</Menu.Item>
							<Menu.Item
								key="form-2"
								icon={<FileTextOutlined />}
								onClick={() => handleGoTo('/form/pj')}>
								Contrato 2
							</Menu.Item>
						</SubMenu>
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
						<SubMenu
							key="sub1"
							icon={<FileAddOutlined />}
							title="Novo Contrato">
							<Menu.Item
								key="form"
								icon={<FileTextOutlined />}
								onClick={() => handleGoTo('/form/company')}>
								Mercado Livre
							</Menu.Item>
							<Menu.Item
								key="form-2"
								icon={<FileTextOutlined />}
								onClick={() => handleGoTo('/form/pj')}>
								Contrato 2
							</Menu.Item>
						</SubMenu>
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
