import React from 'react'
import {
	Steps as StepsAntd,
	Form,
	Button,
	Avatar,
	Typography,
	Space,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { string, shape, arrayOf, number, func, bool } from 'prop-types'

import styles from './index.module.scss'
const { Step } = StepsAntd
const { Title, Text } = Typography

const tailLayout = {
	wrapperCol: { span: 24 },
}

const Steps = ({ steps, current, onClickPrevious, onClickNext, block }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 24,
				margin: 5,
				minHeight: 200,
				background: '#fff',
				border: '1px solid #F0F0F0',
			}}>
			<Title level={3}>Evolução do Documento</Title>
			<StepsAntd
				style={{
					marginTop: '5%',
					marginBottom: '5%',
				}}
				progressDot
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
					justifyContent: 'space-between',
					minHeight: 100,
					background: '#fff',
				}}>
				{steps.map((item, index) => (
					<div key={index} className="steps-content">
						{index <= current ? (
							<Space size={8}>
								<Avatar size={'large'} icon={<UserOutlined />} />
								<Text>André Cordeiro</Text>
							</Space>
						) : (
							<div style={{ width: 180 }}></div>
						)}
					</div>
				))}
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}>
				<Form.Item {...tailLayout}>
					{current !== 0 && (
						<Button
							type="default"
							htmlType="button"
							className={styles.button}
							onClick={onClickPrevious}
							disabled={block}>
							Reprovar
						</Button>
					)}
					{current !== steps.length - 1 && (
						<Button
							type="primary"
							htmlType="button"
							onClick={onClickNext}
							disabled={block}>
							Aprovar
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
	block: bool,
}

export default Steps
