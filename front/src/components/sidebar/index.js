import React, { useEffect } from 'react'
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
} from '@ant-design/icons'
import { getUserList } from '~/states/modules/users'
import { getSettings } from '~/states/modules/settings'
import styles from './index.module.scss'
import logoBlack from '~/assets/logo-dark.svg'
import logoSmall from '~/assets/logo-small.png'
import { setInitialFolder } from '~/states/modules/folder'

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

	function adminSideBar() {
		if (!is_admin) {
			return null
		}
		return (
			<Menu.Item
				key="empresas"
				icon={<IdcardOutlined />}
				onClick={() => {
					handleGoTo('/companies')
				}}>
				<Tooltip className={styles.tooltip}>Empresas</Tooltip>
			</Menu.Item>
		)
	}

	function adminSideBarNotWeb() {
		if (!is_admin) {
			return null
		}
		return (
			<Menu.Item
				key="empresas"
				icon={<IdcardOutlined />}
				onClick={() => handleGoTo('/companies')}>
				Empresas
			</Menu.Item>
		)
	}

	const { Sider } = Layout

	return (
		<>
			{isWeb ? (
				<Sider
					className={styles.sider}
					trigger={null}
					collapsible
					collapsed={collapsed}>
					<div className={styles.logoWrapper}>
						{collapsed ? (
							<img
								src={logoSmall}
								alt="logo"
								className={styles.logoCollapsed}
								width="5"
								height="42"
							/>
						) : (
							data && <img src={data.url} alt="logo" className={styles.logo} />
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
								handleGoTo('/')
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

						{adminSideBar()}
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
						{adminSideBarNotWeb()}
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
