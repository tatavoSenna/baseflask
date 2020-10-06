import React, { useEffect } from 'react'
import { Layout, Input, Button, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import UserModal from './components/modal'
import { getColumns } from './columns'
import {
	getUserList,
	setShowModal,
	updateNewUser,
	createUser,
	deleteUser,
} from '~/states/modules/users'
import BreadCrumb from '~/components/breadCrumb'
import { getLoggedUser } from '~/states/modules/session'

const { Search } = Input

function Users() {
	const { Content } = Layout
	const dispatch = useDispatch()
	const { userList, loading, showModal, newUser } = useSelector(
		({ users }) => users
	)
	const { loggedUser } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getUserList())
		if (!loggedUser) {
			dispatch(getLoggedUser())
		}
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

	const columns = getColumns({ handleDelete, loggedUser })

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
