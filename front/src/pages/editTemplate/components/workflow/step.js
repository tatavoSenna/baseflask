import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { object, array, number } from 'prop-types'
import { Form, Input, InputNumber, Select, Checkbox, Typography } from 'antd'
import {
	editTemplateStepInfo,
	editTemplateStepRemove,
	editTemplateMove,
} from '~/states/modules/editTemplate'
import DragDropCard from '~/components/dragDropCard'
import Delete from '~/components/deleteConfirm'

const { Option } = Select
var groupSelect = null

const { Text } = Typography

const Step = ({ node, groups, users, index }) => {
	const dispatch = useDispatch()

	const groupsChildren = []
	groups.map((item) =>
		groupsChildren.push(<Option key={item.id}>{item.name}</Option>)
	)

	const listUsers = (value) => {
		const list = []
		users.map((user) => {
			user.groups.map((group) => {
				if (group.group_id === parseInt(value)) {
					list.push(
						<Option key={user.key} value={user.id}>
							{user.email}
						</Option>
					)
				}
				return list
			})
			return list
		})
		return list
	}

	const usersList = listUsers(node.responsible_group)
	const [usersChildren, setUsersChildren] = useState(usersList)

	const [expire, setExpire] = useState(
		!(node.deadline === undefined || node.deadline === null)
	)

	const onChangeExpire = (e) => {
		if (e) {
			updateStepInfo(1, index, 'deadline')
			setExpire(true)
		} else {
			updateStepInfo(null, index, 'deadline')
			setExpire(false)
		}
	}

	const updateStepInfo = (e, index, name) => {
		if (name === 'title') {
			const value = e.target.value
			dispatch(editTemplateStepInfo({ value, index, name }))
		} else if (name === 'responsible_group') {
			let value = e
			setUsersChildren(listUsers(value))
			dispatch(editTemplateStepInfo({ value, index, name }))
			dispatch(
				editTemplateStepInfo({ value: '', index, name: 'responsible_users' })
			)
		} else {
			const value = e
			dispatch(editTemplateStepInfo({ value, index, name }))
		}
	}

	const handleRemoveStep = () => {
		dispatch(editTemplateStepRemove({ index }))
	}

	return (
		<DragDropCard index={index} move={editTemplateMove} name={'workflow'}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					height: '32px',
					marginBottom: '24px',
				}}>
				<Form.Item
					name={`description_${index}`}
					label="Descrição"
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
					onChange={(e) => updateStepInfo(e, index, 'title')}>
					<Input value={node.title} />
				</Form.Item>
				<Delete
					handle={() => handleRemoveStep()}
					title="Deseja excluir esse passo?"
				/>
			</div>
			<Form.Item
				name={`group_${index}`}
				label="Grupo"
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
				<Select
					value={node.responsible_group}
					ref={(select) => (groupSelect = select)}
					allowClear
					style={{ width: '100%' }}
					placeholder="Selecione o grupo"
					onChange={(e) => updateStepInfo(e, index, 'responsible_group')}
					onSelect={() => groupSelect.blur()}
					onDeselect={() => groupSelect.blur()}>
					{groupsChildren}
				</Select>
			</Form.Item>
			<Form.Item
				name={`users_${index}`}
				label="Responsáveis"
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
				<Select
					value={node.responsible_users}
					ref={(select) => (groupSelect = select)}
					mode="multiple"
					allowClear
					showSearch
					optionFilterProp="children"
					placeholder="Selecione o responsável"
					onChange={(e) => updateStepInfo(e, index, 'responsible_users')}
					onSelect={() => groupSelect.blur()}
					onDeselect={() => groupSelect.blur()}>
					{usersChildren}
				</Select>
			</Form.Item>
			<div style={{ display: 'flex', marginBottom: '10px' }}>
				<Checkbox
					checked={expire}
					onChange={(e) => onChangeExpire(e.target.checked)}>
					Prazo de validade{expire && ':'}
				</Checkbox>
				{expire && (
					<>
						<Form.Item
							name={`deadline_${index}`}
							rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
							style={{ position: 'relative', bottom: '5px', margin: 0 }}>
							<InputNumber
								value={node.deadline}
								min={1}
								size="small"
								style={{ width: '60px', marginRight: '5px' }}
								onChange={(e) => updateStepInfo(e, index, 'deadline')}
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
	node: object,
	groups: array,
	users: array,
	index: number,
}

Step.defaultProps = {
	groups: [],
}
