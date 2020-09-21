import React from 'react'
import { isEqual } from 'lodash'
import { array, object } from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
	useDispatch,
	//useSelector
} from 'react-redux'
import { Form, Button } from 'antd'

import { appendAnswer, answerRequest } from '~/states/modules/answer'
import InputFactory from '../inputFactory'
import styles from './index.module.scss'

const layout = {
	labelCol: {
		lg: { span: 12 },
		md: { span: 24 },
		sm: { span: 24 },
	},
	wrapperCol: {
		lg: { offset: 1, span: 11 },
		md: { span: 24 },
		sm: { span: 24 },
	},
}
const tailLayout = {
	wrapperCol: { span: 24 },
}

const FormFactory = ({ content }) => {
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()

	// const { answer } = useSelector(({ answer }) => answer)
	// const { validateFields } = form

	// const onValidateForm = async () => {
	// const values = await validateFields()

	// 	console.log('validate')
	// }

	const onSubmit = (data) => {
		dispatch(appendAnswer({ data }))
		console.log(data)
		dispatch(answerRequest({ history }))
	}

	const handleBack = () => {
		history.push(`/form/`)
	}

	return (
		<Form
			{...layout}
			form={form}
			layout="horizontal"
			hideRequiredMark
			onFinish={onSubmit}
			// initialValues={data}
		>
			{content && content.length > 0 && InputFactory({ content })}
			{console.log('content-form')}
			{console.log(content)}
			<div
				{...tailLayout}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: '20px',
				}}>
				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Enviar
					</Button>
				</Form.Item>
			</div>
		</Form>
	)
}

export default FormFactory

FormFactory.propTypes = {
	content: array,
}
FormFactory.defaultProps = {
	content: [],
	edge: {},
}
