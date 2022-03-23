import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { object } from 'prop-types'
import { Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
	editTemplateStepInfo,
	editTemplateStepAdd,
	getGroupsUsers,
} from '~/states/modules/editTemplate'
import { getGroupList, clearGroupsData } from '~/states/modules/groups'
import { uniqBy } from 'lodash'

import Step from './step.js'

const Workflow = ({ form }) => {
	const dispatch = useDispatch()

	const prepareNodesDataForEditing = (node) => {
		return {
			title: node.title,
			deadline: node.deadline,
			next_node: node.next_node || null,
			initialGroup: node.responsible_group,
			responsible_group: node.responsible_group
				? parseInt(node.responsible_group.id)
				: null,
			initialUsers: node.responsible_users,
			responsible_users: node.responsible_users.map((user) =>
				parseInt(user.id)
			),
		}
	}

	useEffect(() => {
		// This component shares the same group reducer with the users page, so we clear the groups store to make sure we will show an updated groups list
		dispatch(clearGroupsData())
	}, [dispatch])

	const nodes = useSelector(
		({
			editTemplate: {
				data: {
					workflow: { nodes },
				},
			},
		}) => nodes.map((node) => prepareNodesDataForEditing(node))
	)

	const groupsLoaded = useSelector(({ groups }) => groups.loaded)
	const groupOptions = useSelector(({ groups }) => {
		if (groups.loaded) {
			return groups.groupsList.map((group) => {
				return { value: group.id, label: group.name }
			})
		} else {
			return uniqBy(
				nodes
					.filter((node) => node.initialGroup)
					.map((node) => {
						return {
							value: parseInt(node.initialGroup.id),
							label: node.initialGroup.name,
						}
					}),
				'value'
			)
		}
	})
	const loadGroups = () => {
		if (!groupsLoaded) {
			dispatch(getGroupList())
		}
	}

	const groupsUsers = useSelector(
		({
			editTemplate: {
				groupsUsers: { data },
			},
		}) => data
	)
	const loadUsers = (index) => {
		const groupId = nodes[index].responsible_group
		if (!(groupId in groupsUsers)) {
			dispatch(getGroupsUsers(groupId))
		}
	}
	const getResponsibleUsersOptions = (nodeIndex) => {
		const groupId = nodes[nodeIndex].responsible_group
		if (groupId in groupsUsers) {
			return groupsUsers[groupId].map((user) => {
				return { value: parseInt(user.id), label: user.name }
			})
		} else {
			return nodes[nodeIndex].initialUsers.map((user) => {
				return { value: parseInt(user.id), label: user.name }
			})
		}
	}

	const updateStep = (index, changedData) => {
		const convertUserFormat = (node) =>
			node.responsible_users.map((userId) => {
				if (node.responsible_group in groupsUsers) {
					const { id, name, email } = groupsUsers[node.responsible_group].find(
						(user) => parseInt(user.id) === parseInt(userId)
					)
					return { id, name, email }
				} else {
					return node.initialUsers.find(
						(user) => parseInt(user.id) === parseInt(userId)
					)
				}
			})

		const convertGroupFormat = (node) => {
			if (node.responsible_group) {
				const { value: id, label: name } = groupOptions.find(
					(group) => parseInt(group.value) === parseInt(node.responsible_group)
				)
				return { id, name }
			}
		}

		const newNode = { ...nodes[index], ...changedData }
		const responsibleGroup = convertGroupFormat(newNode)
		let responsibleUsers = []
		if (responsibleGroup) {
			responsibleUsers = convertUserFormat(newNode)
		}
		newNode.responsible_users = responsibleUsers
		newNode.responsible_group = responsibleGroup
		delete newNode.initialGroup
		delete newNode.initialUsers
		dispatch(editTemplateStepInfo({ index, node: newNode }))
	}

	const handleAddStep = () => {
		const count = Object.keys(nodes).length
		const newStep = {
			title: '',
			next_node: null,
			responsible_users: [],
			responsible_group: null,
			deadline: null,
			changed_by: '',
		}
		dispatch(editTemplateStepAdd({ newStep, count }))
	}

	return (
		<div style={{ maxWidth: '40rem' }}>
			{!nodes.length ? (
				<Empty description="Sem Passos" style={{ marginBottom: '1.5rem' }} />
			) : (
				nodes.map((node, index) => (
					<Step
						key={index}
						form={form}
						node={node}
						loadGroups={loadGroups}
						groupOptions={groupOptions}
						loadingGroups={true}
						loadUsers={loadUsers}
						usersOptions={getResponsibleUsersOptions(index)}
						index={index}
						updateStep={updateStep}
					/>
				))
			)}
			<Button
				block
				icon={<PlusOutlined />}
				size="large"
				type="dashed"
				onClick={() => handleAddStep()}
				style={{ height: '4rem', marginBottom: '1rem' }}
			>
				Novo Passo
			</Button>
		</div>
	)
}

export default Workflow

Workflow.propTypes = {
	form: object,
}
