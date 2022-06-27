import React, { useState } from 'react'
import { Layout, PageHeader, Result, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import DataTable from '~/components/dataTable'
import { getColumns } from '../columns'

import { listItems, editTitle } from '~/states/modules/databaseDetail'

import BreadCrumb from 'components/breadCrumb'
import CreationModal from 'components/creationModal/modal'
import { deleteItem } from 'states/modules/databaseDetail'
import { func } from 'prop-types'

const DatabaseItemsListing = ({ onReturnParent, onCreateText, onEditText }) => {
	const dispatch = useDispatch()
	const { database, items } = useSelector(
		({ databaseDetail }) => databaseDetail
	)

	const [showModal, setShowModal] = useState(false)

	const handleShowModal = () => setShowModal(true)
	const handleCancel = () => setShowModal(false)
	const handleCreate = (title) => {
		setShowModal(false)
		onCreateText(title)
	}

	const handleEditTitleButton = (title) => dispatch(editTitle({ title }))

	const handleDeleteItem = (row) => dispatch(deleteItem({ id: row.id }))

	const handlePaginationAndSearch = ({ page, perPage, search }) =>
		dispatch(listItems({ page, perPage, search }))

	return (
		<>
			<PageHeader>
				<BreadCrumb
					parent="Bancos de textos"
					editable={true}
					current={database.title}
					onEdit={handleEditTitleButton}
					onClickParent={onReturnParent}
				/>
			</PageHeader>
			<Layout style={{ backgroundColor: '#fff' }}>
				<CreationModal
					title="Novo texto"
					label="Título"
					handleCancel={handleCancel}
					handleCreate={handleCreate}
					showModal={showModal}
				/>
				<DataTable
					columns={getColumns(onEditText, handleDeleteItem)}
					dataSource={items.data}
					pages={items.pages}
					onChangePageNumber={handlePaginationAndSearch}
					onSearch={handlePaginationAndSearch}
					onClickButton={handleShowModal}
					textButton="Novo Texto"
					placeholderNoData={
						!items.loading ? (
							<Result
								icon={<></>}
								title={
									<p style={{ color: 'gray' }}>
										Ainda não há textos nesse banco
									</p>
								}
								extra={
									<Button type="primary" onClick={handleShowModal}>
										Novo Texto
									</Button>
								}
								style={{ paddingTop: 0 }}
							/>
						) : (
							''
						)
					}
					loading={items.loading}
				/>
			</Layout>
		</>
	)
}

DatabaseItemsListing.propTypes = {
	onReturnParent: func,
	onCreateText: func,
	onEditText: func,
}

export default DatabaseItemsListing
