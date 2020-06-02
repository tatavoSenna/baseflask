import React from 'react'
import { bool, func } from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import {
	FileAddOutlined,
	FileTextOutlined,
	FolderOpenOutlined,
} from '@ant-design/icons'

// import logo from '~/assets/logo.svg'
import styles from './index.module.scss'

function SideBar({ collapsed, onCollapse }) {
	const history = useHistory()
	const { pathname } = useLocation()

	function handleGoTo(path) {
		onCollapse(true)
		return history.push(path)
	}

	const { SubMenu } = Menu
	const { Sider } = Layout
	return (
		<Sider
			collapsible
			collapsed={collapsed}
			onCollapse={onCollapse}
			collapsedWidth={0}
			defaultCollapsed={true}
			zeroWidthTriggerStyle={{
				top: '10px',
				color: '#fff',
				backgroundColor: '#001529',
			}}
			theme="light"
			className={styles.sidebar}>
			{/* <svg src={logo} alt="Lawing" className={styles.logo} /> */}
			<Menu
				defaultSelectedKeys={[`${pathname.split('/')[1] || '/'}`]}
				mode="inline">
				<Menu.Item
					key="/"
					onClick={() => handleGoTo('/')}
					icon={<FolderOpenOutlined />}>
					Contratos
				</Menu.Item>
				<SubMenu key="sub1" icon={<FileAddOutlined />} title="Novo Contrato">
					<Menu.Item
						key="form"
						icon={<FileTextOutlined />}
						onClick={() => handleGoTo('/form/pj')}>
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
	)
}

SideBar.propTypes = {
	onCollapse: func.isRequired,
	collapsed: bool.isRequired,
}

export default SideBar
