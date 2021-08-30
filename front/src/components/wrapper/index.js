import React, { useState } from 'react'
import { node } from 'prop-types'
import { Layout } from 'antd'
// import ProLayout from '@ant-design/pro-layout'
import { useMediaQuery } from 'react-responsive'
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react'

import Header from '../Header'
import SideBar from '../sidebar'
import styles from './index.module.scss'

function Wrapper({ children }) {
	const [collapsed, setCollapsed] = useState(false)
	const isDesktopOrLaptop = useMediaQuery({
		query: '(min-device-width: 1224px)',
	})
	const handleCollapsed = () => setCollapsed(!collapsed)

	const handleClickContent = () => {
		if (!isDesktopOrLaptop && !collapsed) {
			setCollapsed(!collapsed)
		}
	}

	const { Content } = Layout

	return (
		<AmplifyAuthenticator>
			<AmplifySignIn slot="sign-in" hideSignUp={true} />
			<Layout
				style={{
					height: '100vh',
				}}>
				<SideBar
					collapsed={collapsed}
					handleCollapsed={handleCollapsed}
					isWeb={isDesktopOrLaptop}
				/>
				<Layout className={styles.wrapper}>
					<Header
						handleCollapsed={handleCollapsed}
						isCollapsed={collapsed}
						isWeb={isDesktopOrLaptop}
					/>
					<Content
						onClick={handleClickContent}
						className={styles.siteLayout}
						style={{
							minHeight: 280,
							opacity: !isDesktopOrLaptop && !collapsed ? 0.5 : 1,
						}}>
						{children}
					</Content>
				</Layout>
			</Layout>
		</AmplifyAuthenticator>
	)
}

Wrapper.propTypes = {
	children: node.isRequired,
}

export default Wrapper
