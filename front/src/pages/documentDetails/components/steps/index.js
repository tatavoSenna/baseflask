import React from 'react'
import { Steps as StepsAntd, Typography } from 'antd'
import { string, shape, arrayOf, number } from 'prop-types'

const { Step } = StepsAntd
const { Title } = Typography

const Steps = ({ title, steps, current }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 24,
				margin: 5,
				minHeight: 200,
				background: '#fff',
			}}>
			<Title
				level={4}
				style={{
					marginBottom: '5%',
				}}>
				{title}
			</Title>
			<StepsAntd current={current} labelPlacement="vertical">
				{steps.map((item, index) => (
					<Step
						key={index}
						title={item.title}
						subTitle={item.subTitle}
						description={item.description}
					/>
				))}
			</StepsAntd>
		</div>
	)
}

Steps.propTypes = {
	title: string.isRequired,
	steps: arrayOf(
		shape({
			title: string.isRequired,
			subTitle: string,
			description: string,
		})
	).isRequired,
	current: number.isRequired,
}

export default Steps
