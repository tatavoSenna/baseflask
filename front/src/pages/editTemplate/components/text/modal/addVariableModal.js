import { Input, Modal, Button, Select } from 'antd'
import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import { editTemplateFieldAdd } from 'states/modules/editTemplate'
import { fieldStructure } from '../../form/fieldStructure'
import { bool, func, number, object } from 'prop-types'
import { ButtonWrapper, InputWrapper } from '../../form/widgets/base/styles'

const AddVariableModal = ({ open, onCancel, widgetIndexes, editor }) => {
	const dispatch = useDispatch()

	const [values, setValues] = useState({
		name: '',
		question: '',
		field: '',
	})

	const handleChange = (field, value) => {
		if (field === 'name') {
			const last = value.length - 1

			let updateValue = value
			if (value.charAt(last) === ' ') {
				updateValue = value.slice(0, last) + '_'
			}

			setValues({ ...values, [field]: updateValue })
		} else {
			setValues({ ...values, [field]: value })
		}
	}

	const fieldTypes = [
		{ type: 'text', title: 'Texto' },
		{ type: 'text_area', title: 'Parágrafo' },
		{ type: 'number', title: 'Número' },
		{ type: 'cpf', title: 'CPF' },
		{ type: 'cnpj', title: 'CNPJ' },
		{ type: 'email', title: 'Email' },
		{ type: 'date', title: 'Data' },
		{ type: 'time', title: 'Hora' },
		{ type: 'currency', title: 'Moeda' },
		{ type: 'bank', title: 'Banco' },
		{ type: 'cnae', title: 'CNAE' },
		{ type: 'dropdown', title: 'Dropdown' },
		{ type: 'radio', title: 'Rádio' },
		{ type: 'checkbox', title: 'Checkbox' },
		{ type: 'variable_image', title: 'Upload de imagem' },
		{ type: 'database', title: 'API' },
		{ type: 'internal_database', title: 'Banco de dados' },
		{ type: 'person', title: 'Pessoa' },
		{ type: 'address', title: 'Endereço' },
		{ type: 'structured_list', title: 'Lista Estruturada' },
		{ type: 'separator', title: 'Separador' },
	]

	const onSubmitValues = () => {
		const { field, question, name } = values
		const newField = fieldStructure(field, question, name)
		dispatch(editTemplateFieldAdd({ newField, pageIndex: widgetIndexes }))

		editor.model.change((writer) => {
			writer.insertText(
				`{{ ${name} }}`,
				editor.model.document.selection.getFirstPosition()
			)
		})

		setValues({
			name: '',
			question: '',
			field: '',
		})
		onCancel()
	}

	return (
		<Modal
			title="Nova variável"
			centered
			visible={open}
			footer={null}
			onCancel={onCancel}
			width={450}
			getContainer={false}>
			<InputWrapper>
				<label>Nome:</label>
				<Input
					value={values.name}
					onChange={(e) => handleChange('name', e.target.value.toUpperCase())}
				/>
			</InputWrapper>
			<InputWrapper>
				<label>Pergunta:</label>
				<Input
					value={values.question}
					onChange={(e) => handleChange('question', e.target.value)}
				/>
			</InputWrapper>
			<InputWrapper $marginBottom="24px">
				<label>Tipo de variável:</label>
				<Select value={values.field} onChange={(e) => handleChange('field', e)}>
					{fieldTypes.map((type) => (
						<Select.Option key={type.type} value={type.type}>
							{type.title}
						</Select.Option>
					))}
				</Select>
			</InputWrapper>
			<ButtonWrapper>
				<Button onClick={onSubmitValues}>Criar</Button>
			</ButtonWrapper>
		</Modal>
	)
}

AddVariableModal.propTypes = {
	open: bool,
	onCancel: func,
	widgetIndexes: number,
	editor: object,
}

export default AddVariableModal
