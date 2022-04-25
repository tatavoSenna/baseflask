import { AutoComplete, Form } from 'antd'
import { array, func, number, object } from 'prop-types'
import React from 'react'

const AutocompleteField = ({ signer, info, onSelect, indexSigner }) => {
	return (
		<Form.Item
			name={signer.variable}
			label={`Digite o ${signer.value}`}
			type={signer.type}
			onSelect={(e) => onSelect(e.target.value, indexSigner)}
			hasFeedback
			colon={false}
			initialValue={signer.valueVariable}>
			<AutoComplete
				options={info}
				filterOption={(inputValue, option) =>
					option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
				}
			/>
		</Form.Item>
	)
}

AutocompleteField.propTypes = {
	info: array,
	signer: object,
	onSelect: func,
	indexSigner: number,
}

AutocompleteField.defaultProps = {
	onSelect: () => null,
}

export default AutocompleteField
