import React from 'react'
import { HeartOutlined } from '@ant-design/icons'
import { Layout } from 'antd'

export default function Footer() {
	const { Footer } = Layout
	return (
		<Footer
			style={{ textAlign: 'center', padding: '0 0 14px 0', fontSize: '12px' }}
		>
			By Parafa: Hand crafted & made with <HeartOutlined />
		</Footer>
	)
}
