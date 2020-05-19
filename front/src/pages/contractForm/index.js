import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { listQuestion, awnser } from '~/states/modules/question'
import Loader from '~/components/loader'
import InputFactory from '~/components/inputFactory'

function ContractForm() {
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()
	const { questions, loading } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ documentId: 8 }))
	}, [dispatch])

	const onSubmit = (data) => {
		// console.log(data)
		dispatch(awnser({ data, history }))
	}

	const layout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 12 },
	}

	const tailLayout = {
		wrapperCol: { offset: 10, span: 12 },
	}

	return (
		<Form
			{...layout}
			form={form}
			name="control-hooks"
			onFinish={onSubmit}
			initialValues={{ layout: 'inline' }}>
			{(loading && <Loader />) || (
				<>
					{questions
						.filter((x) => x.value)
						.map((question) => (
							<InputFactory
								name={question.variable}
								label={question.value}
								type={question.type}
							/>
						))}

					<Form.Item {...tailLayout}>
						<Button type="primary" htmlType="submit" size="large">
							Enviar
						</Button>
					</Form.Item>
				</>
			)}
		</Form>
	)
}

export default ContractForm
