import React, { useEffect } from 'react'
import { Layout, Input, Button, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import UserModal from './components/modal'
import GroupModal from './components/groupModal'
import UserEditModal from './components/userEditModal'
import { getColumns } from './columns'
import {
	getUserList,
	setShowModal,
	setShowEditModal,
	updateNewUser,
	updateEditUser,
	createUser,
	deleteUser,
	updateUser,
} from '~/states/modules/users'
import {
	getGroupList,
	setShowGroupModal,
	updateNewGroup,
	createGroup,
} from '~/states/modules/groups'
import BreadCrumb from '~/components/breadCrumb'

const { Search } = Input

function Users() {
	const { Content } = Layout
	const dispatch = useDispatch()
	const {
		userList,
		loading,
		showModal,
		showEditModal,
		newUser,
		editUser,
	} = useSelector(({ users }) => users)
	const { groupList, showGroupModal, newGroup } = useSelector(
		({ groups }) => groups
	)

	const { loggedUser } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getGroupList())
		dispatch(getUserList())
	}, [dispatch, loggedUser])

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handleSearch = (searchInput) => {
		dispatch(getUserList(searchInput))
	}

	const handleCreate = (form) => {
		dispatch(createUser())
		dispatch(setShowModal(false))
		form.resetFields()
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleNewUser = (form) => {
		dispatch(updateNewUser(form.getFieldsValue()))
	}

	const handleDelete = (id) => {
		dispatch(deleteUser(id))
	}

	const handleShowGroupModal = () => {
		dispatch(setShowGroupModal(true))
	}

	const handleGroupCancel = () => {
		dispatch(setShowGroupModal(false))
	}

	const handleGroupCreate = (form) => {
		dispatch(createGroup())
		dispatch(setShowGroupModal(false))
		form.resetFields()
	}

	const handleEdit = (record) => {
		dispatch(updateEditUser(record))
		dispatch(setShowEditModal(true))
	}

	const handleEditUser = (form) => {
		dispatch(updateEditUser(form.getFieldsValue()))
	}

	const handleUpdate = () => {
		dispatch(updateUser())
		dispatch(setShowEditModal(false))
	}

	const handleCancelEdit = (form) => {
		dispatch(setShowEditModal(false))
	}

	const handleNewGroup = (form) => {
		dispatch(updateNewGroup(form.getFieldsValue()))
	}

	const columns = getColumns({ handleDelete, loggedUser, handleEdit })

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb parent="Usuários" current="Lista" />
			<Content
				style={{
					padding: 24,
					margin: 0,
					minHeight: 280,
					background: '#fff',
				}}>
				<UserModal
					handleCancel={handleCancel}
					handleCreate={handleCreate}
					handleNewUser={handleNewUser}
					showModal={showModal}
					newUser={newUser}
					groups={groupList}
				/>
				<UserEditModal
					handleCancel={handleCancelEdit}
					handleUpdate={handleUpdate}
					handleEditUser={handleEditUser}
					showModal={showEditModal}
					editUser={editUser}
					groups={groupList}
				/>
				<GroupModal
					handleCancel={handleGroupCancel}
					handleCreate={handleGroupCreate}
					handleNewGroup={handleNewGroup}
					showModal={showGroupModal}
					newGroup={newGroup}
				/>
				<div
					className="searchbox"
					style={{ display: 'flex', gap: '5px', margin: '24px 0' }}>
					<Search
						placeholder="Procurar por usuário..."
						onSearch={(value) => handleSearch(value)}
						enterButton
					/>
					<Button onClick={handleShowModal}>+ Usuário</Button>
					<Button onClick={handleShowGroupModal}>+ Grupo</Button>
				</div>
				<Table
					dataSource={userList}
					columns={columns}
					loading={loading || !loggedUser}
				/>
			</Content>
		</Layout>
	)
}

export default Users
