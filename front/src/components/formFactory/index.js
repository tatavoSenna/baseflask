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
		<div className={styles['flex-container']}>
			{pageFieldsData && pageFieldsData.fields.length > 0 && (
				<PageHeader className={styles.title}>{pageFieldsData.title}</PageHeader>
			)}
			<Form
				style={{ width: '100%' }}
				form={form}
				layout="vertical"
				hideRequiredMark
				onFinish={onSubmit}
				className={styles['form-container']}>
				{pageFieldsData && pageFieldsData.fields.length > 0 && (
					<div className={styles['form']}>
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
					<div className={styles['flex-row-buttons']}>
						<Form.Item>
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
										token ? handleGoTo('/') : handleGoTo('/documents')
									}}>
									Cancelar
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
	)
}

export default FormFactory

FormFactory.propTypes = {
	token: string,
	initialValues: object,
}
