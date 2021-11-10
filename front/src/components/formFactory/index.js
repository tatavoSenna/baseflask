import React from 'react'
import { object, bool, number, string } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
	formStepsCount,
	url,
	token,
	initialValues,
	currentFormStep,
}) => {
	const dispatch = useDispatch()

	const { visible } = useSelector(({ question }) => question)

	const history = useHistory()
	const [form] = Form.useForm()
	const lastPage = formStepsCount

	const handleBack = () => {
		const previousPage = currentFormStep - 1
		history.push({
			pathname: url,
			state: { current: previousPage },
		})
	}

	function handleGoTo(path) {
		return history.push(path)
	}

	const onSubmit = (data) => {
		dispatch(
			appendAnswer({ data, pageFieldsData, visible: visible[currentFormStep] })
		)
		if (!isLastPage) {
			const nextPage = currentFormStep + 1
			return history.push({
				pathname: url,
				state: { current: nextPage },
			})
		}
		if (token) {
			dispatch(createContractExternal({ token, visible }))
		} else {
			dispatch(answerRequest({ history, visible }))
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
					<InputFactory
						data={pageFieldsData.fields}
						visible={visible[currentFormStep]}
						form={form}
						initialValues={initialValues}
						currentFormStep={currentFormStep}
					/>
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
								<Button
									type="default"
									htmlType="button"
									className={styles.button}
									onClick={() => {
										handleGoTo('/')
									}}>
									Cancelar
								</Button>
							</Form.Item>

							<Form.Item>
								{true && currentFormStep > 0 && (
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
									{currentFormStep + 1} de {lastPage}
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
	formStepsCount: number,
	url: string,
	token: string,
	initialValues: object,
	currentFormStep: number,
}
FormFactory.defaultProps = {
	content: [],
	edge: {},
}
