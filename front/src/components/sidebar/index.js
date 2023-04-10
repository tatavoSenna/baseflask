import React, { useEffect, useMemo } from 'react'
import { bool, func, string } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
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
import { Link } from 'react-router-dom'

const { Sider } = Layout

function SideBar({ collapsed, handleCollapsed, isWeb, selectedKey }) {
	const { data, error, loading } = useSelector(({ settings }) => settings)
	const loggedUser = useSelector(({ session }) => session)
	const dispatch = useDispatch()

	useEffect(() => {
		if (!data.url && !loading && !error) dispatch(getSettings())
	}, [dispatch, data.url, error, loading])

	const { is_admin } = useSelector(({ session }) => session)

	const { accessFolders } = useSelector(({ folder }) => folder)

	const handleFolderRowBack = () => {
		if (accessFolders.length !== 0) {
			dispatch(setInitialFolder())
		}
	}

	const logoSideBar = useMemo(() => {
		if (data.url) {
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
	}, [data.url])

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
							}}
							icon={
								<FolderOpenOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}>
							<Link to="/documents">
								<Tooltip className={styles.tooltip}>Documentos</Tooltip>
							</Link>
						</Menu.Item>
						{loggedUser.is_company_admin && (
							<Menu.Item
								key="templates"
								icon={
									<LayoutOutlined
										className={styles.icons}
										style={{ fontSize: 18 }}
									/>
								}>
								<Link to="/models">
									<Tooltip className={styles.tooltip}>Modelos</Tooltip>
								</Link>
							</Menu.Item>
						)}
						<Menu.Item
							key="databases"
							icon={
								<DatabaseOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}>
							<Link to="/databases">
								<Tooltip className={styles.tooltip}>Bancos de Textos</Tooltip>
							</Link>
						</Menu.Item>
						<Menu.Item
							key="users"
							icon={
								<TeamOutlined
									className={styles.icons}
									style={{ fontSize: 18 }}
								/>
							}>
							<Link to="/users">
								<Tooltip className={styles.tooltip}>Usuários</Tooltip>
							</Link>
						</Menu.Item>
						{is_admin && (
							<Menu.Item
								key="empresas"
								icon={
									<IdcardOutlined
										className={styles.icons}
										style={{ fontSize: 18 }}
									/>
								}>
								<Link to="/companies">
									<Tooltip className={styles.tooltip}>Empresas</Tooltip>
								</Link>
							</Menu.Item>
						)}
						<Menu.Item key="settings" icon={<SettingOutlined />}>
							<Link to="/settings">
								<Tooltip className={styles.tooltip}>Configurações</Tooltip>
							</Link>
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
					<Menu defaultSelectedKeys={[selectedKey]} mode="inline">
						<Menu.Item
							key="/"
							onClick={() => {
								handleFolderRowBack()
							}}
							icon={<FolderOpenOutlined />}>
							<Link to="/documents">Documentos</Link>
						</Menu.Item>
						<Menu.Item key="users" icon={<TeamOutlined />}>
							<Link to="/users">Usuários</Link>
						</Menu.Item>
						<Menu.Item key="templates" icon={<LayoutOutlined />}>
							<Link to="/models">Modelos</Link>
						</Menu.Item>
						<Menu.Item key="settings" icon={<SettingOutlined />}>
							<Link to="/settings">Configurações</Link>
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
