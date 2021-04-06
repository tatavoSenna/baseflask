import React from 'react'
import { object, bool, number, string } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Button, Typography, PageHeader } from 'antd'
import { appendAnswer, answerRequest } from '~/states/modules/answer'
import { createContractExternal } from '~/states/modules/externalContract'
import InputFactory from '../inputFactory'
import styles from './index.module.scss'

const layout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 24 },
		md: { span: 8 },
		lg: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 24 },
		md: { span: 12 },
		lg: { span: 12 },
	},
}

const FormFactory = ({
	pageFieldsData,
	isLastPage,
	pageNumber,
	url,
	token,
}) => {
	const state = useHistory().location.state
	let values = { current: 0 }
	if (state && state.values) {
		values = state.values
	}
	const currentPage = parseInt(values.current)
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()
	const lastPage = pageNumber

	const handleBack = () => {
		const previousPage = currentPage - 1
		history.push({
			pathname: url,
			state: { values: { ...values, current: previousPage } },
		})
	}

	const onSubmit = (data) => {
		dispatch(appendAnswer({ data }))
		if (!isLastPage) {
			const nextPage = currentPage + 1
			return history.push({
				pathname: url,
				state: { values: { ...values, current: nextPage } },
			})
		}
		if (token) {
			dispatch(createContractExternal())
		} else {
			dispatch(answerRequest({ history }))
		}
	}

	return (
		<div>
			{pageFieldsData && pageFieldsData.fields.length > 0 && (
				<PageHeader className={styles.title}>{pageFieldsData.title}</PageHeader>
			)}
			<Form
				{...layout}
				style={{ width: '100%' }}
				form={form}
				layout="horizontal"
				hideRequiredMark
				onFinish={onSubmit}>
				{pageFieldsData && pageFieldsData.fields.length > 0 && (
					<InputFactory data={pageFieldsData.fields} />
				)}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						alignSelf: 'center',
						paddingLeft: '20%',
						paddingRight: '20%',
					}}>
					{pageFieldsData && pageFieldsData.fields.length > 0 && (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: 350,
								minWidth: '50%',
								maxWidth: '100%',
							}}>
							<Form.Item>
								{true && currentPage > 0 && (
									<Button
										type="default"
										htmlType="button"
										className={styles.button}
										onClick={handleBack}>
										Anterior
									</Button>
								)}
							</Form.Item>
							{lastPage > 1 && (
								<Typography className={styles.text}>
									{currentPage + 1} de {lastPage}
								</Typography>
							)}
							<Form.Item>
								<Button
									type="primary"
									className={styles.button}
									htmlType="submit">
									{isLastPage ? 'Enviar' : 'Próximo'}
								</Button>
							</Form.Item>
						</div>
					)}
				</div>
			</Form>
		</div>
	)
}

export default FormFactory

FormFactory.propTypes = {
	pageFieldsData: object,
	isLastPage: bool,
	pageNumber: number,
	url: string,
	token: string,
}
FormFactory.defaultProps = {
	content: [],
	edge: {},
}
