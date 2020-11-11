import React, { useState } from 'react'
import { Input, Button, Modal, Form } from 'antd'
import PropTypes from 'prop-types'
import { AutoComplete } from 'antd'

const ContractModal = ({ handleCreate, handleCancel, showModal, models }) => {
	const [form] = Form.useForm()
	const [modelId, setModelId] = useState('')
	const [title, setTitle] = useState('')
	const [options, setOptions] = useState(models)

	const onSearch = (searchText) =>
		setOptions(
			!searchText
				? models
				: models.filter((model) =>
						model.label.toLowerCase().includes(searchText.toLowerCase())
				  )
		)

	return (
		<Modal
			visible={showModal}
			onCancel={handleCancel}
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button
					key="criar"
					onClick={() => handleCreate({ title, modelId })}
					form="newContractForm"
					disabled={!(title && modelId)}>
					Criar
				</Button>,
			]}>
			<Form form={form} id="newContractForm">
				<Form.Item label="Novo Documento"></Form.Item>
				<Form.Item label="Título" name="title">
					<Input value={title} onChange={(e) => setTitle(e.target.value)} />
				</Form.Item>
				<Form.Item label="Modelo" name="model">
					<AutoComplete
						options={options}
						placeholder="Selecione o modelo"
						style={{ width: '100%' }}
						onSelect={(value, item) => setModelId(item.id)}
						onSearch={onSearch}
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

ContractModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCancel: PropTypes.func,
	handleNewContract: PropTypes.func,
	newContract: PropTypes.object,
	showModal: PropTypes.bool,
	models: PropTypes.array,
}

ContractModal.defaultProps = {
	models: [],
}

export default ContractModal