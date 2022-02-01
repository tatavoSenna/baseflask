import React, { useEffect, useState } from 'react'
import { bool, func } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Layout, Tooltip } from 'antd'
import {
	FolderOpenOutlined,
	TeamOutlined,
	LayoutOutlined,
	SettingOutlined,
	IdcardOutlined,
	FileTextOutlined,
} from '@ant-design/icons'
import { getUserList } from '~/states/modules/users'
import { getSettings } from '~/states/modules/settings'
import styles from './index.module.scss'
import logoBlack from '~/assets/logo-dark.svg'
import logoSmall from '~/assets/logo-small.png'
import { setInitialFolder } from '~/states/modules/folder'

const { Sider } = Layout

function SideBar({ collapsed, handleCollapsed, isWeb }) {
	const { data } = useSelector(({ settings }) => settings)
	const dispatch = useDispatch()
	const history = useHistory()
	const { pathname } = useLocation()

	useEffect(() => {
		dispatch(getUserList())
	}, [dispatch])

	useEffect(() => {
		dispatch(getSettings())
	}, [dispatch])

	const { is_admin } = useSelector(({ session }) => session)

	const handleFolderRowBack = () => {
		dispatch(setInitialFolder())
	}

	function handleGoTo(path) {
		if (!isWeb) {
			handleCollapsed()
		}
		return history.push(path)
	}

	function logoSideBar() {
		if (data) {
			return (
				<img
					src={data.url}
					alt="logo"
					className={styles.logo}
					onError={(e) => {
						e.target.onError = null
						e.target.src = logoSmall
					}}
				/>
			)
		}
		return <img src={logoSmall} alt="logo" className={styles.logo} />
	}

	const [collapse, setCollapse] = useState(false)

	return (
		<>
			{isWeb ? (
				<Sider
					className={styles.sider}
					trigger={null}
					breakpoint="xl"
					onCollapse={(collapsed) => {
						setCollapse(collapsed)
					}}>
					<div className={styles.logoWrapper}>
						{collapse ? (
							<img
								src={logoSmall}
								alt="logo"
								className={styles.logoCollapsed}
								onError={(e) => {
									e.target.onError = null
									e.target.src = logoSmall
								}}
							/>
						) : (
							logoSideBar()
						)}
					</div>
					<Menu
						className={styles.menu}
						mode="inline"
						defaultSelectedKeys={['1']}>
						<Menu.Item
							key="/"
							onClick={() => {
								handleFolderRowBack()
								handleGoTo('/documents')
							}}
							icon={
								<FolderOpenOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}>
							<Tooltip className={styles.tooltip}>Documentos</Tooltip>
						</Menu.Item>
						<Menu.Item
							key="users"
							icon={
								<TeamOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}
							onClick={() => handleGoTo('/users')}>
							<Tooltip className={styles.tooltip}>Usuários</Tooltip>
						</Menu.Item>
						<Menu.Item
							key="templates"
							icon={
								<LayoutOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}
							onClick={() => handleGoTo('/templates')}>
							<Tooltip className={styles.tooltip}>Templates</Tooltip>
						</Menu.Item>
						<Menu.Item
							key="settings"
							icon={<SettingOutlined />}
							onClick={() => handleGoTo('/settings')}>
							<Tooltip className={styles.tooltip}>Configurações</Tooltip>
						</Menu.Item>
						{is_admin && (
							<Menu.Item
								key="empresas"
								icon={
									<IdcardOutlined
										className={styles.icons}
										style={{ fontSize: 18 }}
									/>
								}
								onClick={() => handleGoTo('/companies')}>
								<Tooltip className={styles.tooltip}>Empresas</Tooltip>
							</Menu.Item>
						)}
						{is_admin && (
							<Menu.Item
								key="docs"
								icon={
									<FileTextOutlined
										className={styles.icons}
										style={{ fontSize: 18 }}
									/>
								}
								onClick={() => handleGoTo('/docs')}>
								<Tooltip className={styles.tooltip}>Docs</Tooltip>
							</Menu.Item>
						)}
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
							onClick={() => {
								handleFolderRowBack()
								handleGoTo('/')
							}}
							icon={<FolderOpenOutlined />}>
							Documentos
						</Menu.Item>
						<Menu.Item
							key="users"
							icon={<TeamOutlined />}
							onClick={() => handleGoTo('/users')}>
							Usuários
						</Menu.Item>
						<Menu.Item
							key="templates"
							icon={<LayoutOutlined />}
							onClick={() => handleGoTo('/templates')}>
							Templates
						</Menu.Item>
						<Menu.Item
							key="settings"
							icon={<SettingOutlined />}
							onClick={() => handleGoTo('/settings')}>
							Configurações
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
