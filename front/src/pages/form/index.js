import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Card, Steps } from 'antd'

import { listQuestion } from '~/states/modules/question'

import StepsFactory from './step'

const getCurrentStepAndComponent = ({ edge, content }) => ({
	step: 0,
	component: <StepsFactory content={content?.questions} edge={edge} />,
})

function StepForm() {
	const { current } = useParams()
	const dispatch = useDispatch()
	const [stepComponent, setStepComponent] = useState(<StepsFactory />)
	const [currentStep, setCurrentStep] = useState(0)
	const { questions } = useSelector(({ question }) => question)

	useEffect(() => {
		dispatch(listQuestion({ documentId: 8 }))
	}, [dispatch])

	useEffect(() => {
		const { step, component } = getCurrentStepAndComponent({
			content: questions.nodes ? questions.nodes[current] : null,
			edge: questions.edges ? questions.edges[current] : null,
		})
		setCurrentStep(step)
		setStepComponent(component)
	}, [current, questions])

	const { Step } = Steps
	return (
		<Card bordered={false}>
			<>
				<Steps current={currentStep}>
					<Step />
					<Step />
					<Step />
					<Step />
				</Steps>
				{stepComponent}
			</>
		</Card>
	)
}

export default StepForm
