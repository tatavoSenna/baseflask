import React from 'react'
import { Layout } from 'antd'

import BreadCrumb from '~/components/breadCrumb'

function Home() {
	const { Content } = Layout

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb current="Home" />
			<Content
				style={{
					padding: 24,
					margin: 0,
					minHeight: 280,
					background: '#fff',
				}}>
				Bem vindo a Lawing, a sua plataforma digital de gerenciamento de
				contratos!
			</Content>
		</Layout>
	)
}

export default Home
