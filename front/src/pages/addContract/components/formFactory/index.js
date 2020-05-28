import React from 'react'
import { isEqual } from 'lodash'
import { array, object } from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
	useDispatch,
	//useSelector
} from 'react-redux'
import { Form, Button } from 'antd'

import {
	appendAnswer,
	// answerRequest
} from '~/states/modules/answer'
import InputFactory from '../inputFactory'

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 12 },
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

		// TODO: answerRequest
		console.log('finished')
		console.log(data)
	}

	return (
		<Form
			{...layout}
			form={form}
			layout="horizontal"
			//className={styles.stepForm}
			hideRequiredMark
			onFinish={onSubmit}
			// initialValues={data}
		>
			{content && content.length > 0 && InputFactory({ content })}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					paddingBottom: '50px',
				}}>
				<Button
					type="primary"
					style={{ marginRight: '20px' }}
					onClick={() => history.goBack()}>
					Anterior
				</Button>
				<Button type="primary" htmlType="submit">
					Próximo
				</Button>
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
