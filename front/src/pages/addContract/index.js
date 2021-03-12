import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from 'antd'
import { useHistory } from 'react-router-dom'

import FormFactory from '~/components/formFactory'

import { listQuestion } from '~/states/modules/question'

const getCurrentStepAndComponent = (pageFieldsData, isLastPage, pageNumber) => (
	<FormFactory
		pageFieldsData={pageFieldsData}
		isLastPage={isLastPage}
		pageNumber={pageNumber}
		url="/contracts/new/"
	/>
)

function AddContract() {
	const { values } = useHistory().location.state
	const currentPage = parseInt(values.current)
	const dispatch = useDispatch()
	const [stepComponent, setStepComponent] = useState(<FormFactory />)
	const { data: questions } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ modelId: values.modelId, title: values.title }))
	}, [dispatch, values])

	useEffect(() => {
		const pageFieldsData = questions ? questions[currentPage] : null
		const isLastPage = currentPage === questions.length - 1
		const pageNumber = questions.length
		const pageFormComponent = getCurrentStepAndComponent(
			pageFieldsData,
			isLastPage,
			pageNumber
		)

		setStepComponent(pageFormComponent)
	}, [currentPage, questions])

	return <Layout style={{ backgroundColor: '#fff' }}>{stepComponent}</Layout>
}

export default AddContract
