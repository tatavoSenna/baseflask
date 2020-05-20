import React, { useState } from 'react'
import { node } from 'prop-types'
import { Layout } from 'antd'

import Header from '../header'
import SideBar from '../sidebar'
// import Footer from '../footer'

function Wrapper({ children }) {
	const [collapsed, setCollapsed] = useState(true)

	const onCollapse = (e) => {
		setCollapsed(e)
	}

	return (
		<Layout style={{ height: '100vh' }}>
			<SideBar collapsed={collapsed} onCollapse={onCollapse} />
			<Header />
			<Layout
				style={{
					marginTop: '65px',
					opacity: collapsed ? '1' : '0.2',
				}}
				onClick={() => !collapsed && setCollapsed(true)}>
				{children}
				{/* <Footer /> */}
			</Layout>
		</Layout>
	)
}

Wrapper.propTypes = {
	children: node.isRequired,
}

export default Wrapper
