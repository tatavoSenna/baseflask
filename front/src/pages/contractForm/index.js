import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Row, Col } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { listQuestion, awnser } from '~/states/modules/question'
import Loader from '~/components/loader'
import InputFactory from '~/components/inputFactory'

function ContractForm() {
	const dispatch = useDispatch()
	const history = useHistory()
	const [expand, setExpand] = useState(false)
	const [form] = Form.useForm()
	const { questions, loading } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ documentId: 8 }))
	}, [dispatch])

	const onSubmit = (data) => {
		console.log(data)
		// dispatch(awnser({ data, history }))
	}

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 12 },
	}

	const tailLayout = {
		wrapperCol: { offset: 10, span: 12 },
	}

	const getFields = () => {
		const count = expand ? 10 : 6
		const children = []

		for (let i = 0; i < count; i++) {
			children.push(
				<Col span={8} key={i}>
					<Form.Item
						name={`field-${i}`}
						label={`Field ${i}`}
						rules={[
							{
								required: true,
								message: 'Input something!',
							},
						]}>
						<Input placeholder="placeholder" />
					</Form.Item>
				</Col>
			)
		}

		return children
	}

	/* {questions
						.filter((x) => x.value)
						.map((question) => {
							// console.log(question.parentIndex)
							return (
								<InputFactory
									name={question.variable}
									label={question.value}
									type={question.type}
									callBack={}
								/>
							)
						})} */

	return (
		<Form
			{...layout}
			form={form}
			name="control-hooks"
			onFinish={onSubmit}
			initialValues={{ layout: 'inline' }}>
			{(loading && <Loader />) || getFields()}
			<Row>
				<Col
					span={24}
					style={{
						textAlign: 'right',
					}}>
					<Button type="primary" htmlType="submit">
						Search
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
		</Form>
	)
}

export default ContractForm
