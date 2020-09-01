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

const FormFactory = ({ content, edge }) => {
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
		const { to, end, data: value } = edge
		dispatch(appendAnswer({ data }))

		if (!end || isEqual(data, value)) {
			return history.push(to)
		}

		dispatch(answerRequest({ history }))
	}

	const handleBack = () => {
		const { from } = edge
		history.push(`/form/${from}`)
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
			<div
				{...tailLayout}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: '20px',
				}}>
				<Form.Item {...tailLayout}>
					{edge?.from && (
						<Button
							type="default"
							htmlType="button"
							className={styles.button}
							onClick={handleBack}>
							Anterior
						</Button>
					)}
					<Button type="primary" htmlType="submit">
						Próximo
					</Button>
				</Form.Item>
			</div>
		</Form>
	)
}

export default FormFactory

FormFactory.propTypes = {
	content: array,
	edge: object,
}
FormFactory.defaultProps = {
	content: [],
	edge: {},
}
