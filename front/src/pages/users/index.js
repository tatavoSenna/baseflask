import React, { useEffect, useState } from 'react'
import { Layout, PageHeader } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Auth } from 'aws-amplify'

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
	resendInvite,
} from '~/states/modules/users'
import {
	getGroupList,
	setShowGroupModal,
	updateNewGroup,
	createGroup,
} from '~/states/modules/groups'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import MainLayout from '~/components/mainLayout'

function Users() {
	const dispatch = useDispatch()
	const {
		userList,
		loading,
		showModal,
		showEditModal,
		newUser,
		editUser,
		pages,
	} = useSelector(({ users }) => users)
	const { groupsList, showGroupModal, newGroup } = useSelector(
		({ groups }) => groups
	)

	const [loggedUsername, setLoggedUsername] = useState('-')

	useEffect(() => {
		let mounted = true
		const getUserInfo = async () => {
			const authUserInfo = await Auth.currentUserInfo()
			if (mounted) {
				setLoggedUsername(authUserInfo.username)
			}
		}
		getUserInfo()
		return () => (mounted = false)
	}, [])

	useEffect(() => {
		dispatch(getGroupList())
		dispatch(getUserList())
	}, [dispatch, loggedUsername])

	const getUsers = ({ page, perPage, search }) =>
		dispatch(getUserList({ page, perPage, search }))

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

	const handleResendInvite = (username) => {
		dispatch(resendInvite({ username }))
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

	const handleCancelEdit = () => {
		dispatch(setShowEditModal(false))
	}

	const handleNewGroup = (form) => {
		dispatch(updateNewGroup(form.getFieldsValue()))
	}

	return (
		<MainLayout>
			<Layout style={{ backgroundColor: '#fff' }}>
				<PageHeader>
					<BreadCrumb parent="Usuários" current="Lista" />
				</PageHeader>
				<Layout style={{ backgroundColor: '#fff' }}>
					<UserModal
						handleCancel={handleCancel}
						handleCreate={handleCreate}
						handleNewUser={handleNewUser}
						showModal={showModal}
						newUser={newUser}
						groups={groupsList}
					/>
					<UserEditModal
						handleCancel={handleCancelEdit}
						handleUpdate={handleUpdate}
						handleEditUser={handleEditUser}
						showModal={showEditModal}
						editUser={editUser}
						groups={groupsList}
					/>
					<GroupModal
						handleCancel={handleGroupCancel}
						handleCreate={handleGroupCreate}
						handleNewGroup={handleNewGroup}
						showModal={showGroupModal}
						newGroup={newGroup}
					/>
					<DataTable
						dataSource={userList}
						columns={getColumns({
							handleDelete,
							loggedUsername,
							handleEdit,
							handleResendInvite,
						})}
						loading={loading}
						pages={pages}
						onChangePageNumber={getUsers}
						onSearch={handleSearch}
						onClickButton={handleShowModal}
						textButton="+ Usuário "
						placeholderNoData={!loading ? 'Nenhum usuário encontrado' : ''}
						buttons={[
							{
								title: '+ Grupo',
								onClick: handleShowGroupModal,
							},
						]}
					/>
				</Layout>
			</Layout>
		</MainLayout>
	)
}

export default Users
