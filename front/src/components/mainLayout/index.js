import React, { useState, useCallback } from 'react'
import { node } from 'prop-types'
import { Layout } from 'antd'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'

import Header from '../Header'
import SideBar from '../sidebar'

const StyledMainLayout = styled(Layout)`
	height: 100%;
	background-color: #ececec;
`
const StyledInternalLayout = styled(Layout)`
	background-color: #fff;
	margin-left: 200px;
`
const { Content } = Layout
const StyledMainContent = styled(Content)`
	display: flex;
	justify-content: space-between;
	padding: 0 24px;
`

function MainLayout({ children }) {
	const [collapsed, setCollapsed] = useState(false)
	const isDesktopOrLaptop = useMediaQuery({
		query: '(min-device-width: 1224px)',
	})
	const handleCollapsed = useCallback(
		() => setCollapsed((collapsed) => !collapsed),
		[setCollapsed]
	)

	const handleClickContent = () => {
		if (!isDesktopOrLaptop && !collapsed) {
			setCollapsed(!collapsed)
		}
	}

	return (
		<StyledMainLayout>
			<SideBar
				collapsed={collapsed}
				handleCollapsed={handleCollapsed}
				isWeb={isDesktopOrLaptop}
			/>
			<StyledInternalLayout>
				<Header isWeb={isDesktopOrLaptop} />
				<StyledMainContent onClick={handleClickContent}>
					{children}
				</StyledMainContent>
			</StyledInternalLayout>
		</StyledMainLayout>
	)
}

MainLayout.propTypes = {
	children: node.isRequired,
}

export default MainLayout
