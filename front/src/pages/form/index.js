import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Layout } from 'antd'

import BreadCrumb from '~/components/breadCrumb'
import StepsFactory from './step'

import { listQuestion } from '~/states/modules/question'

const getCurrentStepAndComponent = ({ edge, content }) => ({
	step: 0,
	component: <StepsFactory content={content?.questions} edge={edge} />,
})

function StepForm() {
	const { current } = useParams()
	const dispatch = useDispatch()
	const [stepComponent, setStepComponent] = useState(<StepsFactory />)
	const { questions } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ documentId: 8 }))
	}, [dispatch])

	useEffect(() => {
		const { step, component } = getCurrentStepAndComponent({
			content: questions.nodes ? questions.nodes[current] : null,
			edge: questions.edges ? questions.edges[current] : null,
		})
		// setCurrentStep(step)
		setStepComponent(component)
	}, [current, questions])

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb parent="Contatros" current="Novo Contrato" />
			<Layout
				style={{
					padding: '50px 24px',
				}}>
				{stepComponent}
			</Layout>
		</Layout>
	)
}

export default StepForm
