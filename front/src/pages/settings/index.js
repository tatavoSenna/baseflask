import React, { useState } from 'react'
import { Menu, PageHeader, Layout } from 'antd'
import { FormOutlined, NodeIndexOutlined } from '@ant-design/icons'

import BreadCrumb from '~/components/breadCrumb'
import CompanyConfiguration from './components/companyConfiguration'
import Webhook from './components/webhook'

import styles from './index.module.scss'

const Settings = () => {
	const [breadCrumpCurrent, setBC] = useState('Empresa')
	const [current, setCurrent] = useState('companyConfiguration')

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
			</Menu>
			<Layout className={styles.content}>
				{current === 'companyConfiguration' && <CompanyConfiguration />}
				{current === 'webhook' && <Webhook />}
			</Layout>
		</Layout>
	)
}

export default Settings
