import React from 'react'
import { useDispatch } from 'react-redux'
import { object, func, number } from 'prop-types'
import { Form } from 'antd'
import {
	editTemplateFieldRemove,
	editTemplateMove,
} from '~/states/modules/editTemplate'
import Delete from '~/components/deleteConfirm'
import DragDropCard from '~/components/dragDropCard'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/pt'

const Field = ({ data, pageIndex, fieldIndex, updateFormInfo }) => {
	const dispatch = useDispatch()

	const handleRemoveField = () => {
		dispatch(editTemplateFieldRemove({ pageIndex, fieldIndex }))
	}

	return (
		<DragDropCard
			move={editTemplateMove}
			name="form"
			index={fieldIndex}
			listIndex={pageIndex}
			style={{ padding: '20px 0 0 0' }}>
			<Form.Item
				name={`field_${pageIndex}_${fieldIndex}`}
				style={{ marginBottom: '20px', cursor: 'text' }}>
				<JSONInput
					id={`json_${pageIndex}_${fieldIndex}`}
					onBlur={(e) => updateFormInfo(e.json, 'field', pageIndex, fieldIndex)}
					waitAfterKeyPress={7000}
					placeholder={data}
					locale={locale}
					confirmGood={false}
					theme="light_mitsuketa_tribute"
					height="100%"
					width="100%"
				/>
			</Form.Item>
			<div
				style={{
					display: 'flex',
					background: 'rgba(230, 236, 245, 0.5)',
					height: '40px',
					justifyContent: 'center',
				}}>
				<Delete
					handle={() => handleRemoveField()}
					title="Deseja excluir esse campo?"
				/>
			</div>
		</DragDropCard>
	)
}

export default Field

Field.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
