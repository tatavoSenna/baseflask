import React from 'react'
import { Button, Modal, Form, Typography, Divider } from 'antd'
import PropTypes from 'prop-types'
import AutocompleteField from 'components/autocompleteField'

const { Title } = Typography

const AssignModal = ({
	handleAssign,
	handleCancel,
	showModal,
	signers,
	infos,
}) => {
	const [form] = Form.useForm()

	let objArrayNameEmail = []
	let namesSurnames = []
	let emails = []

	const handleSelect = (value, index) => {
		let variableEmail = ''
		if (signers[index] !== undefined) {
			variableEmail = signers[index]?.fields.find(
				(f) => f?.type === 'email'
			)?.variable
		}
		if (variableEmail !== '') {
			if (value in objArrayNameEmail) {
				if (value !== '')
					form.setFieldsValue({ [variableEmail]: objArrayNameEmail[value] })
			}
		}
	}

	// extract name, surname and email from infos and put in theirs respective arrays
	const fields = infos?.map((info) => info.fields).flat()
	const personFields = fields?.filter((field) => field?.type === 'person')
	const itemsValue = personFields?.map((field) => field.initialValue).flat()

	if (itemsValue !== undefined) {
		objArrayNameEmail = itemsValue.reduce((a, value) => {
			let nameSurname = (value['name'] ?? '') + ' ' + (value['surname'] ?? '')

			let valueEmail = value['email'] ?? ''

			return { ...a, [nameSurname.trim()]: valueEmail }
		}, {})

		namesSurnames = Object.keys(objArrayNameEmail).map((f) =>
			f !== ' ' ? { value: f } : null
		)
		emails = Object.values(objArrayNameEmail).map((f) => ({ value: f }))
	}

	return (
		<Modal
			visible={showModal}
			onCancel={handleCancel}
			footer={[
				<Button key="cancelar" onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button key="salvar" type="primary" htmlType="submit" form="assignForm">
					Salvar
				</Button>,
			]}>
			<Form
				form={form}
				id="assignForm"
				layout="horizontal"
				hideRequiredMark
				onFinish={() => {
					handleCancel()
					handleAssign(form)
				}}>
				<Title level={2} style={{ textAlign: 'center', color: '#999999' }}>
					{'Assinaturas'}
				</Title>
				<Divider />
				{signers.map((item, index) => (
					<div key={index}>
						{index === 0 ? (
							<Title level={4} style={{ marginBottom: 10 }}>
								Parte: {item.party}
							</Title>
						) : null}
						{signers[index - 1] && item.party !== signers[index - 1].party ? (
							<Title level={4} style={{ marginTop: 40, marginBottom: 10 }}>
								Parte: {item.party}
							</Title>
						) : null}
						<Title
							level={4}
							style={{
								marginBottom: 20,
								fontSize: 18,
								fontWeight: 400,
								paddingTop: 20,
								paddingBottom: 10,
							}}>
							{item.title}
						</Title>
						{item.fields.map((item, i) =>
							item.value === 'Nome' ? (
								<AutocompleteField
									key={i}
									indexSigner={index}
									signer={item}
									info={namesSurnames}
									onSelect={handleSelect}
								/>
							) : (
								<AutocompleteField
									key={i}
									indexSigner={index}
									signer={item}
									info={emails}
									form={form}
								/>
							)
						)}
					</div>
				))}
			</Form>
		</Modal>
	)
}

AssignModal.propTypes = {
	handleAssign: PropTypes.func,
	handleCancel: PropTypes.func,
	showModal: PropTypes.bool,
	signers: PropTypes.array,
	infos: PropTypes.array,
}

AssignModal.defaultProps = {
	signers: [],
}

export default AssignModal
