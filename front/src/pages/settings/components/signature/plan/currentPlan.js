import React from 'react'
import propTypes from 'prop-types'
import { Typography } from 'antd'
import moment from 'moment'
import styled from 'styled-components'

const { Title, Paragraph } = Typography

const CurrentPlan = ({ planType, price, payment, expireAt, isCanceled }) => {
	const handlecurrentPrice = () => {
		if (price === null) return ''
		if (payment === 'month') return price + ' por mês'
		return price + ' por ano'
	}

	const expireDate = moment
		.unix(expireAt)
		.local()
		.format('DD [de] MMMM [de] YYYY')

	return (
		<CurrentPlanContainer>
			<FlexContainer>
				<Title style={{ margin: 0 }} level={4}>
					{planType}
				</Title>
				<PriceParagraph>{handlecurrentPrice()}</PriceParagraph>
			</FlexContainer>
			{planType !== 'Gratuito' && (
				<Paragraph style={{ margin: '10px 0 0' }}>
					{isCanceled === true
						? `Seu plano será expirado em ${expireDate}`
						: `Seu plano será renovado em ${expireDate}`}
				</Paragraph>
			)}
		</CurrentPlanContainer>
	)
}

CurrentPlan.propTypes = {
	planType: propTypes.string,
	payment: propTypes.string,
	price: propTypes.string,
	expireAt: propTypes.number,
	isCanceled: propTypes.bool,
}

export default CurrentPlan

const CurrentPlanContainer = styled.div`
	border: 2px solid #40a9ff;
	width: 100%;
	padding: 20px;
`

const FlexContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const PriceParagraph = styled.div`
	margin: 0;
	font-size: 18px;
	font-weight: bold;
`
