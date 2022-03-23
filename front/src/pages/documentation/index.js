import React from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import swaggerDocs from './swagger.json'
import { Layout, PageHeader, Breadcrumb } from 'antd'
import MainLayout from '~/components/mainLayout'

function addHostAndToken(swaggerDocs) {
	swaggerDocs.servers.push({ url: process.env.REACT_APP_API_URL })
	return swaggerDocs
}

const Documentation = () => {
	return (
		<MainLayout>
			<Layout style={{ backgroundColor: '#fff' }}>
				<PageHeader>
					<Breadcrumb>
						<Breadcrumb.Item>Documentação</Breadcrumb.Item>
					</Breadcrumb>
				</PageHeader>
				<SwaggerUI spec={addHostAndToken(swaggerDocs)} />
			</Layout>
		</MainLayout>
	)
}

export default Documentation
