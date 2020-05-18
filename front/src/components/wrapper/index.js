import React from 'react'
import { node } from 'prop-types'
import { Layout } from 'antd'

import Header from '../header'
import SideBar from '../sidebar'
import Footer from '../footer'

function Wrapper({ children }) {
	return (
		<Layout style={{ height: '100vh' }}>
			<SideBar />
			<Layout>
				<Header />
				{children}
				<Footer />
			</Layout>
		</Layout>
	)
}

Wrapper.propTypes = {
	children: node.isRequired,
}

export default Wrapper
