import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Layout, Typography, Spin } from 'antd'
import { getUserProfile } from '~/states/modules/session'

function Home() {
	const { Content } = Layout
	const { Title, Text } = Typography

	const dispatch = useDispatch()
	const history = useHistory()

	dispatch(getUserProfile({ history }))
	return (
		<Layout
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100%',
			}}
		>
			<Content
				style={{
					background: 'transparent',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					flex: 'none',
					padding: 24,
					margin: 0,
					minHeight: 280,
					minWidth: '50%',
					maxWidth: '98%',
					height: '50%',
				}}
			>
				<Title
					style={{
						flex: 'none',
						textAlign: 'center',
					}}
				>
					Bem vindo à Lawing!
				</Title>
				<Text
					level={4}
					style={{
						flex: 'none',
						textAlign: 'center',
					}}
				>
					por favor aguarde enquanto carregamos seus dados
				</Text>
				<Spin
					style={{
						padding: '60px',
					}}
				/>
			</Content>
		</Layout>
	)
}

export default Home
