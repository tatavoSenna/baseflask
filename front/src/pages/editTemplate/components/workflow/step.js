import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { array, number, func, object } from 'prop-types'
import { Form, Input, InputNumber, Select, Checkbox, Typography } from 'antd'
import {
	editTemplateStepRemove,
	editTemplateMove,
} from '~/states/modules/editTemplate'
import DragDropCard from '~/components/dragDropCard'
import Delete from '~/components/deleteConfirm'

const { Text } = Typography

const Step = ({
	form,
	node,
	index,
	loadGroups,
	groupOptions,
	loadUsers,
	usersOptions,
	updateStep,
}) => {
	const dispatch = useDispatch()
	const titleFormItemName = `description_${index}`
	const responsibleGroupFormItemName = `group_${index}`
	const responsibleUsersFormItemName = `users_${index}`
	const deadlineFormItemName = `deadline${index}`

	const [expire, setExpire] = useState(!(node.deadline === 0))

	const updateResponsibleGroup = (event) => {
		const responsible_group = event ? event : null
		updateStep(index, { responsible_group, responsible_users: [] })
		form.setFieldsValue({
			[responsibleUsersFormItemName]: [],
		})
	}

	const updateNodeProperty = (propertyName, propertyValue) => {
		updateStep(index, { [propertyName]: propertyValue })
	}

	const handleRemoveStep = () => {
		dispatch(editTemplateStepRemove({ index }))
		form.setFieldsValue({
			[titleFormItemName]: '',
			[responsibleGroupFormItemName]: null,
			[responsibleUsersFormItemName]: [],
			[deadlineFormItemName]: 0,
		})
	}

	return (
		<DragDropCard index={index} move={editTemplateMove} name={'workflow'}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					height: '32px',
					marginBottom: '24px',
				}}
			>
				<Form.Item
					name={titleFormItemName}
					label="Descrição"
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
					initialValue={node.title}
				>
					<Input
						onChange={(event) => {
							updateNodeProperty('title', event.target.value)
						}}
					/>
				</Form.Item>
				<Delete
					handle={() => handleRemoveStep()}
					title="Deseja excluir esse passo?"
				/>
			</div>
			<Form.Item
				name={responsibleGroupFormItemName}
				label="Grupo"
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
				initialValue={node.responsible_group}
			>
				<Select
					allowClear
					style={{ width: '100%' }}
					placeholder="Selecione o grupo"
					options={groupOptions}
					onFocus={() => loadGroups(node.responsible_group)}
					onChange={updateResponsibleGroup}
				/>
			</Form.Item>
			<Form.Item
				name={responsibleUsersFormItemName}
				label="Responsáveis"
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
				initialValue={node.responsible_users}
			>
				<Select
					mode="multiple"
					showSearch
					placeholder="Selecione os responsáveis"
					onChange={(event) => updateNodeProperty('responsible_users', event)}
					onFocus={() => loadUsers(index)}
					options={usersOptions}
				/>
			</Form.Item>
			<div style={{ display: 'flex', marginBottom: '10px' }}>
				<Checkbox
					checked={expire}
					onChange={(event) => {
						const has_deadline = event.target.checked
						setExpire(event.target.checked)
						updateNodeProperty('deadline', has_deadline ? 1 : 0)
						form.setFieldsValue({
							[deadlineFormItemName]: 1,
						})
					}}
				>
					Prazo de validade{expire && ':'}
				</Checkbox>
				{expire && (
					<>
						<Form.Item
							name={deadlineFormItemName}
							rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
							style={{ position: 'relative', bottom: '5px', margin: 0 }}
							initialValue={node.deadline}
						>
							<InputNumber
								value={node.deadline}
								min={1}
								size="small"
								style={{ width: '60px', marginRight: '5px' }}
								onChange={(event) => {
									updateNodeProperty('deadline', event)
								}}
							/>
						</Form.Item>
						<Text>dia{node.deadline !== 1 && 's'}</Text>
					</>
				)}
			</div>
		</DragDropCard>
	)
}

export default Step

Step.propTypes = {
	form: object,
	node: object,
	index: number,
	loadGroups: func,
	groupOptions: array,
	loadUsers: func,
	usersOptions: array,
	updateStep: func,
}

Step.defaultProps = {
	groups: [],
}
