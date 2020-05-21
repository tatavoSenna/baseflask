import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Row, Col } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { listQuestion, answer } from '~/states/modules/question'
import Loader from '~/components/loader'
// import InputFactory from '~/components/inputFactory'

function ContractForm() {
	const dispatch = useDispatch()
	const history = useHistory()
	const [expand, setExpand] = useState(false)
	const [form] = Form.useForm()
	const { questions, loadingAnswer } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ documentId: 8 }))
	}, [dispatch])

	const onSubmit = (data) => {
		console.log(data)
		dispatch(answer({ data, history }))
	}

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 12 },
	}

	// const tailLayout = {
	// 	wrapperCol: { offset: 10, span: 12 },
	// }

	const getFields = () => {
		const count = expand ? 24 : 14
		const children = []

		for (let i = 0; i < count; i++) {
			const { value, variable, type } = questions[i]
			children.push(
				<Col span={20} key={i}>
					<Form.Item
						span={15}
						name={variable}
						label={value}
						type={type}
						colon={false}
						// rules={[
						// 	{
						// 		required: true,
						// 		message: 'Input something!',
						// 	},
						// ]}
					>
						<Input placeholder="" />
					</Form.Item>
				</Col>
			)
		}

		return children
	}

	return (
		<Form
			{...layout}
			form={form}
			name="control-hooks"
			onFinish={onSubmit}
			initialValues={{ layout: 'inline' }}>
			{(questions.length === 0 && <Loader />) || getFields()}
			{!loadingAnswer ? (
				<Row>
					<Col
						span={24}
						style={{
							textAlign: 'center',
						}}>
						<Button type="primary" htmlType="submit">
							Concluir
						</Button>
						<Button
							style={{
								margin: '0 8px',
							}}
							onClick={() => {
								form.resetFields()
							}}>
							Clear
						</Button>
						<Button
							onClick={() => {
								setExpand(!expand)
							}}>
							Collapse
						</Button>
					</Col>
				</Row>
			) : (
				<Loader />
			)}
		</Form>
	)
}

export default ContractForm
