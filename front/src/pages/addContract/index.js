import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from 'antd'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import FormFactory from '~/components/formFactory'

import { listVisible } from '~/states/modules/question'

const getCurrentStepAndComponent = (
	pageFieldsData,
	isLastPage,
	formStepsCount,
	currentFormStep
) => (
	<FormFactory
		pageFieldsData={pageFieldsData}
		isLastPage={isLastPage}
		formStepsCount={formStepsCount}
		url="/documents/new"
		currentFormStep={currentFormStep}
	/>
)

function AddContract() {
	const dispatch = useDispatch()

	// Get the current step number
	const { current } = useHistory().location.state
	let values = { current: 0 }
	if (current !== undefined) {
		values.current = current
	}
	const currentFormStep = parseInt(values.current)

	// Store the current form step on this component state
	const [stepComponent, setStepComponent] = useState(<FormFactory />)

	const { data: questions } = useSelector(({ question }) => question)
	const { loadingAnswer } = useSelector(({ answer }) => answer)

	// Calculate the visible items of the form
	useEffect(() => {
		if (Object.keys(questions).length > 0) {
			dispatch(listVisible({ questions }))
		}
	}, [dispatch, questions])

	// Build the current step form component
	useEffect(() => {
		const pageFieldsData = questions ? questions[currentFormStep] : null
		const isLastPage = currentFormStep === questions.length - 1
		const formStepsCount = questions.length
		const pageFormComponent = getCurrentStepAndComponent(
			pageFieldsData,
			isLastPage,
			formStepsCount,
			currentFormStep
		)

		setStepComponent(pageFormComponent)
	}, [currentFormStep, questions])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{loadingAnswer ? (
				<LoadingContainer>
					<lottie-player
						src="https://assets1.lottiefiles.com/private_files/lf30_4kmk2efh.json"
						background="transparent"
						speed="1"
						style={{ width: '300px', height: '300px' }}
						loop
						autoplay
					/>
				</LoadingContainer>
			) : (
				stepComponent
			)}
		</Layout>
	)
}

export default AddContract

const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`
