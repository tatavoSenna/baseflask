import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Result } from 'antd'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { SmileOutlined, AlertOutlined } from '@ant-design/icons'

import FormFactory from '~/components/formFactory'

import {
	verifyToken,
	storeURLVariables,
} from '~/states/modules/externalContract'
import { listVisible } from '~/states/modules/question'

const getCurrentStepAndComponent = (
	pageFieldsData,
	isLastPage,
	pageNumber,
	token,
	initialValues
) => (
	<FormFactory
		pageFieldsData={pageFieldsData}
		isLastPage={isLastPage}
		pageNumber={pageNumber}
		url={`/documentcreate/${token}`}
		token={token}
		initialValues={initialValues}
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
	const { search } = useLocation()
	const searchParams = new URLSearchParams(search)

	const dispatch = useDispatch()
	const { created, authorized, filledVars } = useSelector(
		({ externalContract }) => externalContract
	)

	const { data: questions } = useSelector(({ question }) => question)

	useEffect(() => {
		const variables = {}
		for (var p of searchParams) {
			variables[p[0]] = p[1]
		}
		dispatch(storeURLVariables({ variables }))
		// eslint-disable-next-line
	}, [dispatch])

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

		const initialValues = {}
		if (pageFieldsData) {
			pageFieldsData.fields.forEach((field) =>
				Object.entries(filledVars).forEach(([varName, value]) => {
					if (field.variable.name === varName) {
						initialValues[varName] = value
					}
				})
			)
		}

		const pageFormComponent = getCurrentStepAndComponent(
			pageFieldsData,
			isLastPage,
			pageNumber,
			token,
			initialValues
		)

		setStepComponent(pageFormComponent)
	}, [currentPage, questions, token, filledVars])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{authorized && !created ? stepComponent : getMessage(created)}
		</Layout>
	)
}

export default AddContractExternal
