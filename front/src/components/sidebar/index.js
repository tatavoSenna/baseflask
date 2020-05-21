import React from 'react'
import { bool, func } from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import {
	FileAddOutlined,
	// HomeOutlined,
	FileOutlined,
	TeamOutlined,
	FileDoneOutlined,
} from '@ant-design/icons'

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
			style={{
				position: 'absolute',
				height: '100%',
				backgroundColor: 'fff',
				zIndex: 2,
			}}>
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
						onClick={() => handleGoTo('/addContracts')}>
						Novo contrato
					</Menu.Item>
				</SubMenu>
				<SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
					<Menu.Item key="6">Team 1</Menu.Item>
					<Menu.Item key="8">Team 2</Menu.Item>
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
