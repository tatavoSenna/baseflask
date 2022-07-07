import React, { useCallback, useRef } from 'react'
import { object, number } from 'prop-types'
import { useDispatch } from 'react-redux'
import { Input, Divider } from 'antd'
import styled from 'styled-components'
import {
	editTemplateFieldRemove,
	editTemplateMove,
} from '~/states/modules/editTemplate'
import Delete from '~/components/deleteConfirm'
import DragDropCard from '~/components/dragDropCard'

import { useUpdate } from './base/widget'
import { useEffect } from 'react'

export const SeparatorWidget = React.memo((props) => {
	const { data, pageIndex, fieldIndex } = props
	const update = useUpdate(props)

	const dispatch = useDispatch()

	const handleRemoveField = useCallback(() => {
		dispatch(editTemplateFieldRemove({ pageIndex, fieldIndex }))
	}, [dispatch, pageIndex, fieldIndex])

	const ref = useRef()

	useEffect(() => {
		let inputEl = ref?.current?.input
		if (inputEl)
			inputEl.setAttribute('size', (data.title || 'Separador').length - 2)
	}, [ref, data])

	return (
		<DragDropCard
			move={editTemplateMove}
			name="form"
			index={fieldIndex}
			listIndex={pageIndex}
			style={{
				padding: '0',
			}}>
			<div
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					padding: '7px 16px 7px 40px',
					justifyContent: 'space-between',
				}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-start',
						width: '94%',
					}}>
					<CustomDivider $width="45px" type="horizontal" orientation="left" />
					<Input
						size="large"
						placeholder="Separador"
						bordered={false}
						ref={ref}
						onBlur={(e) => update({ title: e.target.value })}
						defaultValue={data.title}
						style={{
							color: 'darkgray',
							width: 'initial',
						}}
						onChange={(e) => {
							e.target.setAttribute(
								'size',
								e.target.value.length > 0
									? e.target.value.length - 2
									: 'Separador'.length - 2
							)
						}}
					/>
					<CustomDivider
						$grow
						$width="fit-content"
						type="horizontal"
						orientation="left"
					/>
				</div>
				<Delete
					handle={handleRemoveField}
					title="Deseja excluir esse campo?"
					onClick={(e) => e.stopPropagation()}
				/>
			</div>
		</DragDropCard>
	)
})

let CustomDivider = styled(Divider)`
	&& {
		border-color: #d3d3d3bf;
		flex-grow: ${({ $grow }) => $grow && 1};
		width: ${({ $width }) => $width || '100%'};
		min-width: ${({ $width }) => $width || '0px'};
		margin: 0px;
	}

	.ant-divider-inner-text {
		font-size: 14px;
		color: gray;
	}
`

SeparatorWidget.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
}
