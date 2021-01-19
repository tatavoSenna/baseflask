import React from 'react'
import { object, bool } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'antd'
import { appendAnswer, answerRequest } from '~/states/modules/answer'
import InputFactory from '../inputFactory'
import { Typography, Divider } from 'antd'
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

const { Title } = Typography

const FormFactory = ({ pageFieldsData, isLastPage }) => {
	const { values } = useHistory().location.state
	const currentPage = parseInt(values.current)
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()

	const handleBack = () => {
		const previousPage = currentPage - 1
		history.push({
			pathname: `/contracts/new/`,
			state: { values: { ...values, current: previousPage } },
		})
	}

	const onSubmit = (data) => {
		dispatch(appendAnswer({ data }))
		if (!isLastPage) {
			const nextPage = currentPage + 1
			return history.push({
				pathname: `/contracts/new/`,
				state: { values: { ...values, current: nextPage } },
			})
		}
		dispatch(answerRequest({ history }))
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
			<Title level={4}>{pageFieldsData ? pageFieldsData.title : ''}</Title>
			<Divider />
			{pageFieldsData && pageFieldsData.fields.length > 0 && (
				<InputFactory data={pageFieldsData.fields} />
			)}
			<div
				// {...tailLayout}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: '20px',
				}}>
				<Form.Item {...tailLayout}>
					{true && (
						<Button
							type="default"
							htmlType="button"
							className={styles.button}
							onClick={handleBack}>
							Anterior
						</Button>
					)}
					<Button type="primary" htmlType="submit">
						{isLastPage ? 'Enviar' : 'Proximo'}
					</Button>
				</Form.Item>
			</div>
		</Form>
	)
}

export default FormFactory

FormFactory.propTypes = {
	pageFieldsData: object,
	isLastPage: bool,
}
FormFactory.defaultProps = {
	content: [],
	edge: {},
}
