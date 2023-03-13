import React, { useEffect, useMemo } from 'react'
import { bool, func, string } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { Menu, Layout, Tooltip } from 'antd'
import {
	FolderOpenOutlined,
	TeamOutlined,
	LayoutOutlined,
	SettingOutlined,
	IdcardOutlined,
	DatabaseOutlined,
} from '@ant-design/icons'
import { getSettings } from '~/states/modules/settings'
import styles from './index.module.scss'
import logoBlack from '~/assets/logo-dark.svg'
import logoSmall from '~/assets/logo-small.png'
import { setInitialFolder } from '~/states/modules/folder'

const { Sider } = Layout

function SideBar({ collapsed, handleCollapsed, isWeb, selectedKey }) {
	const { data } = useSelector(({ settings }) => settings)
	const loggedUser = useSelector(({ session }) => session)
	const dispatch = useDispatch()
	const history = useHistory()
	const { pathname } = useLocation()
	useEffect(() => {
		if (!data) dispatch(getSettings())
	}, [dispatch, data])

	const { is_admin } = useSelector(({ session }) => session)

	const { accessFolders } = useSelector(({ folder }) => folder)

	const handleFolderRowBack = () => {
		if (accessFolders.length !== 0) {
			dispatch(setInitialFolder())
		}
	}

	function handleGoTo(path) {
		if (!isWeb) {
			handleCollapsed()
		}
		return history.push(path)
	}

	const logoSideBar = useMemo(() => {
		if (data) {
			return (
				<img
					src={typeof data !== 'string' ? data.url : data}
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
	}, [data])

	const dynamicCollapse = useMediaQuery({
		query: '(max-width: 1200px)',
	})

	return (
		<>
			{isWeb ? (
				<Sider
					style={{ position: 'fixed' }}
					className={styles.sider}
					trigger={null}
					collapsed={dynamicCollapse}
					collapsible>
					<div className={styles.logoWrapper}>
						{dynamicCollapse ? (
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
							logoSideBar
						)}
					</div>
					<Menu
						className={styles.menu}
						mode="inline"
						defaultSelectedKeys={[selectedKey]}>
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
						{loggedUser.is_company_admin && (
							<Menu.Item
								key="templates"
								icon={
									<LayoutOutlined
										className={styles.icons}
										style={{ fontSize: 18 }}
									/>
								}
								onClick={() => handleGoTo('/models')}>
								<Tooltip className={styles.tooltip}>Modelos</Tooltip>
							</Menu.Item>
						)}
						<Menu.Item
							key="databases"
							icon={
								<DatabaseOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}
							onClick={() => handleGoTo('/databases')}>
							<Tooltip className={styles.tooltip}>Bancos de Textos</Tooltip>
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
						<Menu.Item
							key="settings"
							icon={<SettingOutlined />}
							onClick={() => handleGoTo('/settings')}>
							<Tooltip className={styles.tooltip}>Configurações</Tooltip>
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
							onClick={() => handleGoTo('/models')}>
							Modelos
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
	selectedKey: string,
}

SideBar.deafultProps = {
	isWeb: true,
}

export default React.memo(SideBar)
