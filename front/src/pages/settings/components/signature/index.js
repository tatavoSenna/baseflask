import React, { useState, useEffect } from 'react'
import { Button, Typography, Card } from 'antd'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import Plan from './plan'
import {
	getStripePlan,
	uploadStripePlan,
	uploadStripePlanPortal,
} from 'states/modules/settings'
import CurrentPlan from './plan/currentPlan'
import FormPortal from './plan/formPortal'
import { filterPlans, findPlan } from './plan/service/plansService'

const { Title, Paragraph } = Typography

const Signature = () => {
	const dispatch = useDispatch()
	const { loading, priceId, expireAt, isCanceled } = useSelector(
		({ settings }) => settings
	)

	const [monthYear, setMonthYear] = useState(true)
	// const [planType, setPlanType] = useState('Plano anuais')
	const [planTypeTitle, setPlanTypeTitle] = useState('Planos mensais')
	const [plans, setPlans] = useState(filterPlans('month'))
	const [thisPrice, setThisPrice] = useState(priceId)
	const [currentPlan, setCurrentPlan] = useState({})

	useEffect(() => {
		dispatch(getStripePlan())
		setCurrentPlan(findPlan(priceId))
	}, [dispatch, priceId])

	const handleChangePrice = (value) => {
		setThisPrice(value)
	}

	const handleSubmitStripe = (e) => {
		e.preventDefault()
		if (thisPrice !== 'price_1KP85XHIZcJ4D4nayv0Sx6dc') {
			dispatch(uploadStripePlan(thisPrice))
		}
	}

	const handleSubmitStripePortal = (e) => {
		e.preventDefault()
		dispatch(uploadStripePlanPortal())
	}

	const handleChangeValue = () => {
		if (monthYear) {
			// setPlanType('Planos mensais')
			setPlanTypeTitle('Plano anuais')
			setPlans(filterPlans('year'))
			setMonthYear(false)
			return
		}

		// setPlanType('Plano anuais')
		setPlanTypeTitle('Planos mensais')
		setPlans(filterPlans('month'))
		setMonthYear(true)
		return
	}

	const freePlan = findPlan('price_1KP85XHIZcJ4D4nayv0Sx6dc')
	const activePlan = findPlan(priceId)

	return (
		<div style={{ marginBottom: 50 }}>
			<SCard loading={loading}>
				<Container>
					<TitlePlan>
						<Title style={{ margin: 0 }} level={4}>
							{'Plano atual'}
						</Title>
						<FormPortal
							onSubmitStripe={handleSubmitStripePortal}
							priceId={priceId}
						/>
					</TitlePlan>
					<FlexContainer>
						{priceId === null ? (
							<CurrentPlan
								payment={freePlan.payment}
								planType={freePlan.type}
								price={freePlan.price}
								expireAt={expireAt}
								isCanceled={isCanceled}
							/>
						) : (
							currentPlan !== undefined && (
								<CurrentPlan
									payment={currentPlan.payment}
									planType={currentPlan.type}
									price={currentPlan.price}
									expireAt={expireAt}
									isCanceled={isCanceled}
								/>
							)
						)}
					</FlexContainer>
				</Container>
			</SCard>
			<SCard loading={loading}>
				<Container>
					<TitlePlan>
						<Title style={{ margin: 0 }} level={4}>
							{planTypeTitle}
						</Title>
						<Button onClick={handleChangeValue} type="primary">
							Ver mais
						</Button>
					</TitlePlan>
					<FlexContainer>
						{plans.map((plan, key) => (
							<Plan
								key={key}
								planType={plan.type}
								info={plan.info}
								value={plan.value}
								selected={plan.selected}
								price={plan.price}
								onChangePrice={handleChangePrice}
								onSubmitStripe={handleSubmitStripe}
								priceId={priceId}
								activePlan={activePlan}
							/>
						))}
					</FlexContainer>
				</Container>
			</SCard>
			<SCard loading={loading}>
				<Container>
					<Paragraph style={{ margin: 0, fontSize: 18 }}>
						Mais de 500 docs por mês?
					</Paragraph>
					<Paragraph style={{ margin: 0, fontSize: 18 }}>
						Entre em contato!
					</Paragraph>
				</Container>
			</SCard>
		</div>
	)
}

export default Signature

const SCard = styled(Card)`
	border: none;
	max-width: 800px;

	.ant-card-body {
		margin: 50px 0 0;
		padding: 0;
	}
`

const Container = styled.div`
	border: 1px solid #e8e8e8;
	max-width: 800px;
	padding: 30px;
`

const TitlePlan = styled.div`
	display: flex;
	justify-content: space-between;
`

const FlexContainer = styled.div`
	display: flex;
	gap: 1rem;
	width: 100%;
	margin: 30px 0 0;
`
