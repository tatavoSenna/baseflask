import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Result } from 'antd'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { SmileOutlined, AlertOutlined } from '@ant-design/icons'

import FormFactory from '~/components/formFactory'

import { verifyToken } from '~/states/modules/externalContract'

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
	const { form, data, created, authorized } = useSelector(
		({ externalContract }) => externalContract
	)
	useEffect(() => {
		dispatch(verifyToken({ token }))
	}, [dispatch, token])
	const state = useHistory().location.state
	let values = { current: 0, ...data }
	if (state && state.values) {
		values = state.values
	}
	const currentPage = parseInt(values.current)
	const [stepComponent, setStepComponent] = useState(<FormFactory />)

	useEffect(() => {
		const pageFieldsData = form ? form[currentPage] : null
		const isLastPage = currentPage === form.length - 1
		const pageNumber = form.length
		const pageFormComponent = getCurrentStepAndComponent(
			pageFieldsData,
			isLastPage,
			pageNumber,
			token
		)

		setStepComponent(pageFormComponent)
	}, [currentPage, form, token])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{authorized && !created ? stepComponent : getMessage(created)}
		</Layout>
	)
}

export default AddContractExternal
