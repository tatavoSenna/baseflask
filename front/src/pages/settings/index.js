import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Menu, PageHeader, Layout } from 'antd'
import {
	FormOutlined,
	NodeIndexOutlined,
	DeploymentUnitOutlined,
	EditOutlined,
	ArrowUpOutlined,
} from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

import BreadCrumb from '~/components/breadCrumb'
import CompanyConfiguration from './components/companyConfiguration'
import Webhook from './components/webhook'
import Integration from './components/integration'
import Signature from './components/signature'
import BaseDocument from './components/baseDocument'

import styles from './index.module.scss'
import MainLayout from '~/components/mainLayout'

const Settings = () => {
	const { search } = useLocation()
	const searchParams = new URLSearchParams(search)

	const [breadCrumpCurrent, setBC] = useState('Empresa')
	const [current, setCurrent] = useState(
		searchParams.get('tab') ?? 'companyConfiguration'
	)

	const { is_financial } = useSelector(({ session }) => session)

	const handleNav = (e) => {
		setCurrent(e.key)
		if (e.key === 'webhook') {
			setBC('Webhook')
		}
		if (e.key === 'companyConfiguration') {
			setBC('Empresa')
		}
	}

	return (
		<MainLayout selectedKey={'settings'}>
			<Layout style={{ backgroundColor: '#fff' }}>
				<PageHeader>
					<BreadCrumb parent="Configurações" current={breadCrumpCurrent} />
				</PageHeader>
				<Menu
					onClick={handleNav}
					selectedKeys={[current]}
					mode="horizontal"
					style={{ display: 'flex' }}>
					<Menu.Item key="companyConfiguration" icon={<FormOutlined />}>
						Configurações da Empresa
					</Menu.Item>
					<Menu.Item key="webhook" icon={<NodeIndexOutlined />}>
						Webhook
					</Menu.Item>
					<Menu.Item key="integration" icon={<DeploymentUnitOutlined />}>
						Integração
					</Menu.Item>
					{is_financial && (
						<Menu.Item key="signature" icon={<EditOutlined />}>
							Planos e pagamentos
						</Menu.Item>
					)}
					<Menu.Item key="baseDocument" icon={<ArrowUpOutlined />}>
						Documento base
					</Menu.Item>
				</Menu>
				<Layout className={styles.content}>
					{current === 'companyConfiguration' && <CompanyConfiguration />}
					{current === 'webhook' && <Webhook />}
					{current === 'integration' && <Integration />}
					{current === 'signature' && <Signature />}
					{current === 'baseDocument' && <BaseDocument />}
				</Layout>
			</Layout>
		</MainLayout>
	)
}

export default Settings
