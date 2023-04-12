import React from 'react'
import styled from 'styled-components'
import { number, string } from 'prop-types'

const TitleSeparator = ({ key, className }) => {
	return (
		<Title key={key} className={className}>
			Procurador
		</Title>
	)
}

TitleSeparator.propTypes = {
	key: number,
	className: string,
}

export default TitleSeparator

const Title = styled.p`
	order: 11;
	flex: 1 0 100%;

	font-size: 18px;
	font-weight: 500;
	margin-bottom: 24px;
`
