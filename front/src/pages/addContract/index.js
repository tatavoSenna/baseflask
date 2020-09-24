import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Card, Layout, PageHeader } from 'antd'

import BreadCrumb from '~/components/breadCrumb'
import FormFactory from './components/formFactory'

import { listQuestion } from '~/states/modules/question'

const getCurrentStepAndComponent = (pageFieldsData, isLastPage) => (
	<FormFactory pageFieldsData={pageFieldsData} isLastPage={isLastPage} />
)

function AddContract() {
	const { current, model } = useParams()
	const currentPage = parseInt(current)
	const dispatch = useDispatch()
	const [stepComponent, setStepComponent] = useState(<FormFactory />)
	const { data: questions, loading } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ modelId: model }))
	}, [dispatch, model])

	useEffect(() => {
		const pageFieldsData = questions ? questions[currentPage] : null
		const isLastPage = currentPage === questions.length - 1
		const pageFormComponent = getCurrentStepAndComponent(
			pageFieldsData,
			isLastPage
		)
		setStepComponent(pageFormComponent)
	}, [currentPage, questions])

	return (
		<Layout>
			<PageHeader>
				<BreadCrumb parent="Contratos" current={'Novo Contrato'} />
			</PageHeader>
			<Card
				style={{
					maxWidth: '800px',
					width: '100%',
				}}
				loading={loading}>
				{stepComponent}
			</Card>
		</Layout>
	)
}

export default AddContract
