import React, { useState, useEffect } from 'react'
import {
	Input,
	Button,
	Modal,
	Form,
	Checkbox,
	InputNumber,
	Typography,
	Tooltip,
} from 'antd'
import PropTypes from 'prop-types'
import { AutoComplete } from 'antd'
import styled from 'styled-components'
import { QuestionCircleFilled } from '@ant-design/icons'

const { Title } = Typography

const ContractModal = ({
	handleCreate,
	handleCreateLink,
	handleCancel,
	showModal,
	models,
}) => {
	const [form] = Form.useForm()
	const [modelId, setModelId] = useState('')
	const [title, setTitle] = useState('')
	const [maxUses, setUses] = useState(0)
	const [options, setOptions] = useState(models)
	const [checked, setChecked] = useState(false)

	const onSearch = (searchText) =>
		setOptions(
			!searchText
				? models
				: models.filter((model) =>
						model.label.toLowerCase().includes(searchText.toLowerCase())
				  )
		)
	useEffect(() => {
		setOptions(models)
	}, [models])

	const getFooterModal = () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'flex-end',
			}}>
			<Button key="cancelar" onClick={handleCancel}>
				Cancelar
			</Button>
			<Button
				style={{ marginLeft: 30 }}
				type="primary"
				key="criar"
				onClick={() =>
					checked
						? handleCreateLink({ title, modelId, maxUses })
						: handleCreate({ title, modelId })
				}
				form="newContractForm"
				disabled={!(title && modelId)}>
				Criar
			</Button>
		</div>
	)

	return (
		<StyledModal
			visible={showModal}
			closable={false}
			destroyOnClose={true}
			footer={null}>
			<Form form={form} id="newContractForm">
				<Title
					level={4}
					style={{
						color: 'rgba(0, 0, 0, 0.45)',
						textAlign: 'center',
						marginBottom: 0,
					}}>
					Novo Documento
				</Title>
				<NewDivider />
				<StyledItemForm label="Título" name="title">
					<Input
						style={{ width: '90%' }}
						autoFocus
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</StyledItemForm>
				<StyledItemForm label="Modelo" name="model">
					<AutoComplete
						options={options}
						placeholder="Selecione o modelo"
						//style={{ width: '100%' }}
						onSelect={(value, item) => setModelId(item.id)}
						onSearch={onSearch}
						style={{ width: '90%' }}
					/>
				</StyledItemForm>
				<StyledItemForm>
					<Checkbox
						onChange={(e) => setChecked(e.target.checked)}
						checked={checked}>
						Criar URL externa
					</Checkbox>
				</StyledItemForm>
				<StyledItemForm
					label="Número de usos"
					name="uses"
					hidden={!checked}
					rules={[
						{
							type: 'number',
							min: 0,
							message: 'Número inválido!',
						},
					]}>
					<InputNumber
						autoFocus
						value={maxUses}
						min={0}
						onChange={(e) => setUses(e)}
					/>
					<Tooltip placement="top" title="Selecione 0 para a url não expirar">
						<QuestionCircleFilled style={{ marginLeft: '7px' }} />
					</Tooltip>
				</StyledItemForm>

				<NewDivider />
				{getFooterModal()}
			</Form>
		</StyledModal>
	)
}

ContractModal.propTypes = {
	handleCreate: PropTypes.func,
	handleCreateLink: PropTypes.func,
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

const StyledItemForm = styled(Form.Item)`
	.ant-form-item-label {
		padding: 0;
	}
`

const NewDivider = styled.div`
	background: rgba(0, 0, 0, 0.25);
	height: 0.8px;
	margin: 28px 0;
`

const StyledModal = styled(Modal)`
	.ant-modal-body {
		padding: 28px;
	}
`
