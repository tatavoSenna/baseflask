import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Card, Layout } from 'antd'

import BreadCrumb from '~/components/breadCrumb'
import FormFactory from './components/formFactory'

import { listQuestion } from '~/states/modules/question'

const getCurrentStepAndComponent = ({ edge, content }) => ({
	step: 0,
	component: <FormFactory content={content?.questions} edge={edge} />,
})

function AddContract() {
	const { current } = useParams()
	const dispatch = useDispatch()
	const [stepComponent, setStepComponent] = useState(<FormFactory />)
	const { data: questions, loading } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ documentId: 10 }))
	}, [dispatch])

	useEffect(() => {
		const { component } = getCurrentStepAndComponent({
			content: questions.nodes ? questions.nodes[current] : null,
			edge: questions.edges ? questions.edges[current] : null,
		})
		// setCurrentStep(step)
		setStepComponent(component)
	}, [current, questions])

	return (
		<Layout>
			<BreadCrumb parent="Contatros" current="Novo Contrato" />
			<Layout
				style={{
					display: 'flex',
					alignItems: 'center',
				}}>
				<Card
					style={{
						maxWidth: '800px',
						width: '100%',
					}}
					loading={loading}>
					{stepComponent}
				</Card>
			</Layout>
		</Layout>
	)
}

export default AddContract
