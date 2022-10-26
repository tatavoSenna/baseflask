import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Layout } from 'antd'

import { useDispatch } from 'react-redux'
import { answerRequest } from '~/states/modules/answer'
import FormFactory from '~/components/formFactory'

import { useHistory } from 'react-router-dom'
import { listQuestion } from 'states/modules/question'
import styled from 'styled-components'

function AddContract() {
	const { loadingAnswer } = useSelector(({ answer }) => answer)
	const { loading } = useSelector(({ question }) => question)
	const dispatch = useDispatch()

	const { modelId, title, parent } = useHistory().location.state

	const handleFinish = useCallback(
		(draft, history) => {
			dispatch(answerRequest({ history, draft }))
		},
		[dispatch]
	)

	useEffect(() => {
		dispatch(
			listQuestion({
				modelId: modelId,
				title: title,
				parent: parent,
			})
		)
	}, [dispatch, modelId, title, parent])

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
			) : !loading ? (
				<FormFactory onFinish={handleFinish} cancelRoute={'/documents'} />
			) : null}
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
