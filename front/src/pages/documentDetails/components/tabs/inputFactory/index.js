import React from 'react'
import { object } from 'prop-types'
import EmailField from '~/components/emailField'
import TextField from '~/components/textField'

function InputFactory(fields) {
	const children = []
	for (let i = 0; i < fields.length; i++) {
		const { type } = fields[i]
		switch (type) {
			case 'email':
				children.push(
					<EmailField
						key={i + fields[i].variable}
						inputValue={!fields[i].valueVariable ? '' : fields[i].valueVariable}
						pageFieldsData={fields[i]}
						OutsideLabel="Digite o email: "
					/>
				)
				break
			default:
				children.push(
					<TextField
						key={i + fields[i].variable}
						inputValue={!fields[i].valueVariable ? '' : fields[i].valueVariable}
						OutsideLabel="Digite o nome: "
						pageFieldsData={fields[i]}
					/>
				)
		}
	}

	return children
}

InputFactory.propTypes = {
	content: object.isRequired,
}

export default InputFactory
