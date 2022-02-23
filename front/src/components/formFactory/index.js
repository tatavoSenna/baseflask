import React from 'react'
import { object, string } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Typography, PageHeader } from 'antd'
import { appendAnswer, answerRequest } from '~/states/modules/answer'
import { nextPage, previousPage } from 'states/modules/question'
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

const FormFactory = ({ token, initialValues }) => {
	const dispatch = useDispatch()

	const { data: questions, visible, currentPage, lastPage } = useSelector(
		({ question }) => question
	)

	const history = useHistory()
	const [form] = Form.useForm()
	const isLastPage = currentPage === lastPage
	const pageFieldsData = questions[currentPage]

	function handleGoTo(path) {
		return history.push(path)
	}

	const onPrevious = () => {
		dispatch(previousPage())
	}

	const onSubmit = (data) => {
		dispatch(
			appendAnswer({ data, pageFieldsData, visible: visible[currentPage] })
		)

		if (!isLastPage) {
			dispatch(nextPage())
		} else {
			if (token) {
				dispatch(createContractExternal({ token, visible }))
			} else {
				dispatch(answerRequest({ history, visible }))
			}
		}
	}

	return (
		<div>
			{pageFieldsData && (
				<PageHeader className={styles.title}>{pageFieldsData.title}</PageHeader>
			)}
			<Form
				{...layout}
				style={{ width: '100%' }}
				form={form}
				layout="horizontal"
				hideRequiredMark
				onFinish={onSubmit}>
				{pageFieldsData && (
					<InputFactory
						data={pageFieldsData.fields}
						visible={visible[currentPage]}
						form={form}
						initialValues={initialValues}
						currentFormStep={currentPage}
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
					{pageFieldsData && (
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
								{true && currentPage > 0 && (
									<Button
										type="default"
										htmlType="button"
										className={styles.button}
										onClick={onPrevious}>
										Anterior
									</Button>
								)}
							</Form.Item>
							{lastPage > 0 && (
								<Typography className={styles.text}>
									{currentPage + 1} de {lastPage + 1}
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
	token: string,
	initialValues: object,
}
