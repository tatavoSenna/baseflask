import React from 'react'
import { bool, func, object } from 'prop-types'
import { Col, Input, Row, Switch } from 'antd'

import { FormItem } from './styles'

export const CommonFields = ({ hasDescription, ...props }) => {
	const { data, update, extraFields } = props

	return (
		<>
			<div
				style={{
					marginTop: '24px',
					display: 'flex',
					flexDirection: 'column',
				}}>
				<Row justify="end">
					<Col>{extraFields}</Col>
					<Col>
						<FormItem
							style={{ alignSelf: 'flex-end' }}
							label="Opcional"
							$width={'fit-content'}
							$labelTop={'1px'}>
							<Switch
								defaultChecked={data.optional}
								onChange={(e) => update({ optional: e })}
							/>
						</FormItem>
					</Col>
				</Row>
				<FormItem label="Título" $width={'100%'}>
					<Input
						onBlur={(e) => update({ label: e.target.value })}
						defaultValue={data.label}
						autoComplete="off"
						style={{ width: '100%' }}
					/>
				</FormItem>
			</div>
			{hasDescription ?? true ? (
				<FormItem label="Descrição">
					<Input
						onBlur={(e) => update({ info: e.target.value })}
						defaultValue={data.info}
						autoComplete="off"
					/>
				</FormItem>
			) : null}
		</>
	)
}

CommonFields.propTypes = {
	hasDescription: bool,
	update: func,
	data: object,
	extraFields: object,
}
