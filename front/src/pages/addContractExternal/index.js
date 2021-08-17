import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Result } from 'antd'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { SmileOutlined, AlertOutlined } from '@ant-design/icons'

import FormFactory from '~/components/formFactory'

import { verifyToken } from '~/states/modules/externalContract'
import { listVisible } from '~/states/modules/question'

const getCurrentStepAndComponent = (
	pageFieldsData,
	isLastPage,
	pageNumber,
	token
) => (
	<FormFactory
		pageFieldsData={pageFieldsData}
		isLastPage={isLastPage}
		pageNumber={pageNumber}
		url={`/documentcreate/${token}`}
		token={token}
	/>
)

const getMessage = (success) => (
	<Result
		status={success ? 'success' : 'warning'}
		icon={success ? <SmileOutlined /> : <AlertOutlined />}
		title={
			success
				? 'Documento criado com sucesso!'
				: 'Atenção! Documento já foi criado!'
		}
	/>
)

const AddContractExternal = () => {
	const { token } = useParams()

	const dispatch = useDispatch()
	const { created, authorized } = useSelector(
		({ externalContract }) => externalContract
	)

	const { data: questions } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(verifyToken({ token }))
	}, [dispatch, token])

	const state = useHistory().location.state
	let values = { current: 0 }
	if (state && state.values) {
		values = state.values
	}
	const currentPage = parseInt(values.current)

	useEffect(() => {
		if (Object.keys(questions).length > 0) {
			dispatch(listVisible({ questions }))
		}
	}, [dispatch, questions])

	const [stepComponent, setStepComponent] = useState(<FormFactory />)

	useEffect(() => {
		const pageFieldsData = questions ? questions[currentPage] : null
		const isLastPage = currentPage === questions.length - 1
		const pageNumber = questions.length
		const pageFormComponent = getCurrentStepAndComponent(
			pageFieldsData,
			isLastPage,
			pageNumber,
			token
		)

		setStepComponent(pageFormComponent)
	}, [currentPage, questions, token])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{authorized && !created ? stepComponent : getMessage(created)}
		</Layout>
	)
}

export default AddContractExternal
