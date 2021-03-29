import React from 'react'
import { useDispatch } from 'react-redux'
import { object, func, number } from 'prop-types'
import { Card, Form } from 'antd'
import { postTemplateFieldRemove } from '~/states/modules/postTemplate'
import Delete from '~/components/deleteConfirm'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/pt'

const Field = ({ data, pageIndex, fieldIndex, updateFormInfo }) => {
	const dispatch = useDispatch()

	const handleRemoveField = () => {
		dispatch(postTemplateFieldRemove({ pageIndex, fieldIndex }))
	}

	return (
		<Card
			actions={[
				<Delete
					handle={() => handleRemoveField()}
					title="Deseja excluir esse campo?"
				/>,
			]}
			style={{
				marginBottom: '3%',
			}}>
			<Form.Item
				name={`field_${pageIndex}_${fieldIndex}`}
				style={{ marginBottom: '0' }}>
				<JSONInput
					id={`json_${pageIndex}_${fieldIndex}`}
					onChange={(e) =>
						updateFormInfo(e.json, 'field', pageIndex, fieldIndex)
					}
					placeholder={data}
					locale={locale}
					confirmGood={false}
					theme="light_mitsuketa_tribute"
					height="100%"
					width="100%"
					style={{ fontSize: '40px' }}
				/>
			</Form.Item>
		</Card>
	)
}

export default Field

Field.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	updateFormInfo: func,
}
