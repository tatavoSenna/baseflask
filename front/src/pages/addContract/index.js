import React from 'react'
import { useSelector } from 'react-redux'
import { Layout } from 'antd'
import styled from 'styled-components'

import FormFactory from '~/components/formFactory'

function AddContract() {
	const { loadingAnswer } = useSelector(({ answer }) => answer)
	const { loading } = useSelector(({ question }) => question)

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
				<FormFactory />
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
