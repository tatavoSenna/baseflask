import React from 'react'
import { bool, func } from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import {
	FileAddOutlined,
	FileOutlined,
	FileDoneOutlined,
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
			<Menu defaultSelectedKeys={[`${pathname}`]} mode="inline">
				<SubMenu key="sub1" icon={<FileOutlined />} title="Contratos">
					<Menu.Item
						key="/contracts"
						icon={<FileDoneOutlined />}
						onClick={() => handleGoTo('/contracts')}>
						Contratos
					</Menu.Item>
					<Menu.Item
						key="/addContracts"
						icon={<FileAddOutlined />}
						onClick={() => handleGoTo('/form/pj')}>
						Novo contrato
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
