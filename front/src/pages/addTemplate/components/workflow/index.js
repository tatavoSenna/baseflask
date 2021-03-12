import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { object, func } from 'prop-types'
import { Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { postTemplateStepAdd } from '~/states/modules/postTemplate'
import { getGroupList } from '~/states/modules/groups'
import { getUserList } from '~/states/modules/users'

import Step from './step'

const Workflow = ({ data }) => {
	const dispatch = useDispatch()

	const { groupList } = useSelector(({ groups }) => groups)
	const { userList } = useSelector(({ users }) => users)
	const { loggedUser } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getGroupList())
		dispatch(getUserList())
	}, [dispatch, loggedUser])

	const handleAddStep = () => {
		const count = Object.keys(data.nodes).length
		const newStep = {
			title: '',
			next_node: null,
			responsible_user: '',
			responsible_groups: [],
			changed_by: '',
		}

		dispatch(postTemplateStepAdd({ newStep, count }))
	}

	return (
		<div style={{ maxWidth: '40rem' }}>
			{!Object.keys(data.nodes).length ? (
				<Empty description="Sem Passos" style={{ marginBottom: '1.5rem' }} />
			) : (
				data.nodes.map((node, index) => (
					<Step
						key={index}
						node={node}
						groups={groupList}
						users={userList}
						index={index}
					/>
				))
			)}
			<Button
				block
				icon={<PlusOutlined />}
				size="large"
				type="dashed"
				onClick={() => handleAddStep()}
				style={{ height: '4rem', marginBottom: '1rem' }}>
				Novo Passo
			</Button>
		</div>
	)
}

export default Workflow

Workflow.propTypes = {
	data: object,
}
