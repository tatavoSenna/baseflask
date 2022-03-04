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
		md: { span: 20 },
		xl: { span: 16 },
	},
}

const FormFactory = ({ token, initialValues = {} }) => {
	const dispatch = useDispatch()

	const { data: questions, visible, currentPage } = useSelector(
		({ question }) => question
	)

	const history = useHistory()
	const [form] = Form.useForm()
	const lastPage = questions.length
	const isLastPage = currentPage + 1 === lastPage
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
		<div className={styles['grid-container']}>
			<div className={styles['grid-col']}>
				{pageFieldsData && pageFieldsData.fields.length > 0 && (
					<PageHeader className={styles.title}>
						{pageFieldsData.title}
					</PageHeader>
				)}
				<Form
					{...layout}
					style={{ width: '100%' }}
					form={form}
					layout="vertical"
					hideRequiredMark
					onFinish={onSubmit}
					className={styles['form']}>
					{pageFieldsData && pageFieldsData.fields.length > 0 && (
						<div className={styles['inputs']}>
							<InputFactory
								data={pageFieldsData.fields}
								visible={visible[currentPage]}
								form={form}
								initialValues={initialValues}
								currentFormStep={currentPage}
							/>
						</div>
					)}

					{pageFieldsData && pageFieldsData.fields.length > 0 && (
						<div className={styles['grid-row-buttons']}>
							<Form.Item className={styles['button-cancel']}>
								{true && currentPage > 0 ? (
									<Button
										block
										type="default"
										htmlType="button"
										className={styles.button}
										onClick={onPrevious}>
										Anterior
									</Button>
								) : (
									<Button
										block
										type="default"
										htmlType="button"
										className={styles.button}
										onClick={() => {
											handleGoTo('/')
										}}>
										Cancelar
									</Button>
								)}
							</Form.Item>

							{lastPage > 1 && (
								<Typography className={styles['text']}>
									{currentPage + 1} de {lastPage}
								</Typography>
							)}

							<Form.Item className={styles['button-submit']}>
								<Button
									block
									type="primary"
									className={styles.button}
									htmlType="submit">
									{isLastPage ? 'Enviar' : 'Próximo'}
								</Button>
							</Form.Item>
						</div>
					)}
				</Form>
			</div>
		</div>
	)
}

export default FormFactory

FormFactory.propTypes = {
	token: string,
	initialValues: object,
}
