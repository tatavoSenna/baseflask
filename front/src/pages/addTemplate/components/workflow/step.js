import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { object, array, number } from 'prop-types'
import { Card, Form, Input, Select, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import {
	postTemplateStepInfo,
	postTemplateStepRemove,
} from '~/states/modules/postTemplate'

const { Option } = Select
var groupSelect = null

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
					list.push(<Option key={user.key}>{user.email}</Option>)
				}
				return list
			})
			return list
		})
		return list
	}

	const usersList = listUsers(node.responsible_groups[0])
	const [usersChildren, setUsersChildren] = useState(usersList)

	const updateStepInfo = (e, index, name) => {
		if (name === 'title') {
			const value = e.target.value
			dispatch(postTemplateStepInfo({ value, index, name }))
		} else if (name === 'responsible_groups') {
			let value = e
			setUsersChildren(listUsers(value))
			dispatch(postTemplateStepInfo({ value, index, name }))
			dispatch(
				postTemplateStepInfo({ value: '', index, name: 'responsible_user' })
			)
		} else {
			const value = e
			dispatch(postTemplateStepInfo({ value, index, name }))
		}
	}

	const handleRemoveStep = () => {
		dispatch(postTemplateStepRemove({ index }))
	}

	return (
		<Card style={{ marginBottom: '1rem' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Form.Item
					name={`description_${index}`}
					label="Descrição"
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
					onChange={(e) => updateStepInfo(e, index, 'title')}>
					<Input value={node.title} />
				</Form.Item>
				<Button
					icon={<DeleteOutlined />}
					onClick={() => handleRemoveStep()}
					style={{}}
				/>
			</div>
			<Form.Item
				name={`group_${index}`}
				label="Grupo"
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
				<Select
					value={node.responsible_groups[0]}
					ref={(select) => (groupSelect = select)}
					allowClear
					style={{ width: '100%' }}
					placeholder="Selecione o grupo"
					onChange={(e) => updateStepInfo(e, index, 'responsible_groups')}
					onSelect={() => groupSelect.blur()}
					onDeselect={() => groupSelect.blur()}>
					{groupsChildren}
				</Select>
			</Form.Item>
			<Form.Item
				name={`responsible_${index}`}
				label="Responsável"
				rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
				<Select
					value={node.responsible_user}
					ref={(select) => (groupSelect = select)}
					allowClear
					showSearch
					optionFilterProp="children"
					placeholder="Selecione o responsável"
					onChange={(e) => updateStepInfo(e, index, 'responsible_user')}
					onSelect={() => groupSelect.blur()}
					onDeselect={() => groupSelect.blur()}>
					{usersChildren}
				</Select>
			</Form.Item>
		</Card>
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
