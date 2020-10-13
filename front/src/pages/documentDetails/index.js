import React from 'react'
import { Layout, PageHeader } from 'antd'
import Steps from '~/pages/documentDetails/components/steps'
import Tabs from '~/pages/documentDetails/components/tabs'
import Editor from '~/pages/documentDetails/components/editor'

import BreadCrumb from '~/components/breadCrumb'

const DocumentDetails = () => {
	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<PageHeader>
				<BreadCrumb parent="Contratos" current="Detalhe" />
			</PageHeader>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					paddingBottom: 50,
				}}>
				<div>
					<Steps
						current={4}
						title="Evolução do Documento"
						steps={[
							{
								title: 'Comercial',
							},
							{
								title: 'Engenharia',
							},
							{
								title: 'Jurídico',
							},
							{
								title: 'Diretoria',
							},
							{
								title: 'Assinatura',
							},
							{
								title: 'Finalizado',
							},
						]}
					/>
					<Editor />
				</div>
				<Tabs />
			</div>
		</Layout>
	)
}

export default DocumentDetails
