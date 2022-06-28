import React from 'react'
import { bool, func, object } from 'prop-types'
import { Input, Switch } from 'antd'

import { FormItem } from './styles'

export const CommonFields = ({ hasDescription, ...props }) => {
	const { data, update } = props

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginTop: '24px',
				}}>
				<FormItem label="Título" $width={'70%'}>
					<Input
						onBlur={(e) => update({ label: e.target.value })}
						defaultValue={data.label}
						autoComplete="off"
						style={{ width: '100%' }}
					/>
				</FormItem>

				<FormItem label="Opcional" $width={'27%'} $labelTop={'1px'}>
					<Switch
						defaultChecked={data.optional}
						onChange={(e) => update({ optional: e })}
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
}
