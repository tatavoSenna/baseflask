import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Layout } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { login } from '~/states/modules/session'
import background from '~/assets/background.svg'
import logo from '~/assets/logo.svg'

function Login() {
	const history = useHistory()
	const dispatch = useDispatch()

	const handleSubmit = (data) => {
		dispatch(login({ ...data, history }))
	}

	const { Footer } = Layout

	return (
		<Layout
			style={{
				backgroundImage: `url(${background})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				height: '100vh',
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'space-between',
			}}>
			<Form
				name="normal_login"
				className="login-form"
				align="end"
				// initialValues={{ remember: true }}
				onFinish={handleSubmit}
				style={{
					margin: '24px 24px',
					width: '30vw',
				}}>
				<Form.Item
					name="email"
					rules={[{ required: true, message: 'O campo email é obrigatório!' }]}>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Email"
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: 'O campo senha é obrigatório!' }]}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Senha"
					/>
				</Form.Item>
				<Form.Item>
					<a href="/login" className="login-form-forgot">
						Esqueceu a senha
					</a>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button">
						Entrar
					</Button>
				</Form.Item>
			</Form>
			<Footer style={styles.logoBox}>
				<img src={logo} alt="logo" style={{ width: '140px' }} />
			</Footer>
		</Layout>
	)
}

const styles = {
	logoBox: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-start',
		backgroundColor: 'transparent',
	},
}

export default Login
