import React, { useState } from 'react'
import { Modal, Button, Form, Select, DatePicker } from 'antd'
import PropTypes, { array, number } from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

const StepModal = ({
	showModal,
	handleCancel,
	handleSave,
	stepData,
	current,
	groups,
	users,
}) => {
	const [form] = Form.useForm()
	const { Option } = Select
	const initialDate = current >= 0 ? stepData[current].due_date : ''
	const initialGroupId = current >= 0 ? String(stepData[current].group.id) : ''
	const initialUsersIds =
		current >= 0
			? stepData[current].responsible_users.map((user) => String(user.id))
			: ''

	const groupOptions = groups.map((group) => (
		<Option key={group.id}>{group.name}</Option>
	))

	const getUserOptions = (currentGroupId) => {
		const userOptions = []
		users.map((user) => {
			user['groups'].forEach((userGroup) => {
				if (String(currentGroupId) === String(userGroup.group_id)) {
					userOptions.push(<Option key={user.id}>{user.name}</Option>)
				}
				return null
			})
			return null
		})
		return userOptions
	}
	const [userOptions, setUserOptions] = useState(getUserOptions(initialGroupId))

	const getFooterModal = () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'flex-end',
			}}>
			<Button key="cancelar" onClick={handleCancel} size="large">
				Cancelar
			</Button>
			<Button
				key="salvar"
				onClick={() => {
					var dueDate = form.getFieldValue('dueDate')
					if (typeof dueDate == 'object') {
						dueDate = new Date(dueDate).toISOString()
					} else {
						dueDate = initialDate
					}

					handleSave({
						group: form.getFieldValue('group'),
						responsibleUsers: form.getFieldValue('users'),
						dueDate: dueDate,
					})
				}}
				type="primary"
				size="large"
				style={{ marginLeft: 30 }}>
				Confirmar
			</Button>
		</div>
	)

	return (
		<StyledModal visible={showModal} closable={false} footer={null} width={460}>
			<NewDivider />
			<Form
				form={form}
				hideRequiredMark
				id="stepForm"
				layout="horizontal"
				initialValues={{
					group: initialGroupId,
					users: initialUsersIds,
					dueDate: moment(initialDate),
				}}>
				<StyledItemForm label="Grupo responsável" name="group">
					<Select
						mode="single"
						style={{ width: '90%' }}
						placeholder="Selecione o grupo"
						onChange={(value) => {
							form.setFieldsValue({ users: [] })
							setUserOptions(getUserOptions(value))
						}}>
						{groupOptions}
					</Select>
				</StyledItemForm>

				<StyledItemForm label="Responsáveis" name="users">
					<Select
						mode="multiple"
						style={{ width: '90%' }}
						allowClear
						placeholder="Selecione os responsáveis">
						{userOptions}
					</Select>
				</StyledItemForm>

				<StyledItemForm label="Prazo" name="dueDate">
					<DatePicker
						allowClear={false}
						format={'DD/MM/YYYY'}
						disabledDate={(pickerDate) => pickerDate < moment().endOf('day')}
					/>
				</StyledItemForm>
				<NewDivider />
				{getFooterModal()}
			</Form>
		</StyledModal>
	)
}

StepModal.propTypes = {
	handleCancel: PropTypes.func,
	handleSave: PropTypes.func,
	showModal: PropTypes.bool,
	stepData: array,
	current: number,
	groups: array,
	users: array,
}

export default StepModal

const NewDivider = styled.div`
	background: rgba(0, 0, 0, 0.25);
	height: 0.8px;
	margin: 28px 0;
`

const StyledItemForm = styled(Form.Item)`
	.ant-form-item-label {
		padding: 0;
	}
`

const StyledModal = styled(Modal)`
	.ant-modal-body {
		padding: 28px;
	}
`
