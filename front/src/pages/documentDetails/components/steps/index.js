import React from 'react'
import { Steps as StepsAntd, Form, Button } from 'antd'
import { string, shape, arrayOf, number, func } from 'prop-types'

import styles from './index.module.scss'
const { Step } = StepsAntd

const tailLayout = {
	wrapperCol: { span: 24 },
}

const Steps = ({ steps, current, onClickPrevious, onClickNext }) => {
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
			<StepsAntd
				style={{
					marginTop: '5%',
					marginBottom: '5%',
				}}
				current={current}
				labelPlacement="vertical">
				{steps.map((item, index) => (
					<Step
						key={index}
						title={item.title}
						subTitle={item.subTitle}
						description={item.description}
					/>
				))}
			</StepsAntd>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
				}}>
				<Form.Item {...tailLayout}>
					{current !== 0 && (
						<Button
							type="default"
							htmlType="button"
							className={styles.button}
							onClick={onClickPrevious}>
							Anterior
						</Button>
					)}
					{current !== steps.length - 1 && (
						<Button type="primary" htmlType="button" onClick={onClickNext}>
							Próximo
						</Button>
					)}
				</Form.Item>
			</div>
		</div>
	)
}

Steps.propTypes = {
	steps: arrayOf(
		shape({
			title: string.isRequired,
			subTitle: string,
			description: string,
		})
	).isRequired,
	current: number.isRequired,
	onClickPrevious: func.isRequired,
	onClickNext: func.isRequired,
}

export default Steps
