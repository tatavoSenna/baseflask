import React, { useState } from 'react'
import { Form, Input, Button, Layout, Steps } from 'antd'

import BreadCrumb from '~/components/breadCrumb'

const AddContact = () => {
	const [current, setCurrent] = useState(0)
	const [form] = Form.useForm()

	const onChangeCurrent = (e) => {
		setCurrent(e)
	}

	const onSubmit = (data) => {
		console.log(data)
	}

	const { Content } = Layout
	const { Step } = Steps
	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb current="Novo Contrato" />
			<Content
				className="site-layout-background"
				style={{
					padding: 30,
					margin: 0,
					minHeight: 280,
				}}>
				<Steps
					type="navigation"
					current={current}
					style={{ marginBottom: '40px' }}
					onChange={onChangeCurrent}
					className="site-navigation-steps">
					<Step status="finish" title="Step 1" />
					<Step status={current === 1 ? 'process' : 'wait'} title="Step 2" />
					<Step status={current === 2 ? 'process' : 'wait'} title="Step 3" />
					<Step status={current === 3 ? 'process' : 'wait'} title="Step 4" />
					<Step status={current === 4 ? 'process' : 'wait'} title="Step 4" />
					<Step status={current === 5 ? 'process' : 'wait'} title="Step 4" />
				</Steps>
				<Form
					form={form}
					name="control-hooks"
					onFinish={onSubmit}
					initialValues={{ layout: 'inline' }}>
					<Form.Item name="name" label="Name" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Button type="primary" htmlType="submit">
								Próximo
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Content>
		</Layout>
	)
}

export default AddContact
