import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import {
	FileAddOutlined,
	HomeOutlined,
	FileOutlined,
	TeamOutlined,
	FileDoneOutlined,
} from '@ant-design/icons'

function SideBar() {
	const history = useHistory()
	const { pathname } = useLocation()
	const [collapsed, setCollapsed] = useState(true)

	const onCollapse = (e) => {
		setCollapsed(e)
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
				zIndex: '1',
			}}>
			<Menu defaultSelectedKeys={[`${pathname}`]} mode="inline">
				<Menu.Item
					key="/"
					icon={<HomeOutlined />}
					onClick={() => history.push('/')}>
					Home
				</Menu.Item>
				<SubMenu key="sub1" icon={<FileOutlined />} title="Contratos">
					<Menu.Item
						key="/contracts"
						icon={<FileDoneOutlined />}
						onClick={() => history.push('/contracts')}>
						Contratos
					</Menu.Item>
					<Menu.Item
						key="/addContracts"
						icon={<FileAddOutlined />}
						onClick={() => history.push('/addContracts')}>
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

export default SideBar
