import React from 'react'
import { Layout } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import ContractForm from '../contractForm'

const AddContact = () => {
	const { Content } = Layout
	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb current="Novo Contrato" />
			<Content
				className="site-layout-background"
				style={{
					padding: 30,
					margin: 0,
					minHeight: 280,
				}}>
				<ContractForm />
			</Content>
		</Layout>
	)
}

export default AddContact
