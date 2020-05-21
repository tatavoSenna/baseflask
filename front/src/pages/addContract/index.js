import React from 'react'
import { Layout } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import ContractForm from '../contractForm'

const AddContact = () => {
	const { Content } = Layout
	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb parent="Contratos" current="Novo Contrato" />
			<Content
				style={{
					padding: 24,
					margin: 0,
					minHeight: 280,
					height: '100%',
					background: '#fff',
				}}>
				<Content
					className="site-layout-background"
					style={{
						padding: 30,
						margin: 0,
						minHeight: 280,
					}}>
					<ContractForm />
				</Content>
			</Content>
		</Layout>
	)
}

export default AddContact
