import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import CreationModal from 'components/creationModal/modal'
import { getColumns } from './columns'
import {
	setShowModal,
	listDatabases,
	createDatabase,
	deleteDatabase,
} from '../../states/modules/databases'

import MainLayout from '~/components/mainLayout'

const Databases = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const {
		data: databases,
		loading,
		pages,
		showModal,
	} = useSelector(({ database }) => database)

	const handleCreate = (title) => {
		dispatch(setShowModal(false))
		dispatch(createDatabase({ title, history }))
	}

	const handleToGo = (database) => {
		history.push({
			pathname: `/databases/${database.id}`,
		})
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handleDeleteDatabase = (database) =>
		dispatch(deleteDatabase({ id: database.id, pages }))

	const getDatabases = ({ page, perPage, search }) =>
		dispatch(listDatabases({ page, perPage, search }))

	const handleSearch = ({ page, perPage, search }) =>
		dispatch(listDatabases({ page, perPage, search }))

	useEffect(() => {
		dispatch(listDatabases())
	}, [dispatch])

	return (
		<MainLayout>
			<Layout style={{ backgroundColor: '#fff' }}>
				<PageHeader>
					<BreadCrumb current="Bancos de textos" />
				</PageHeader>
				<Layout style={{ backgroundColor: '#fff' }}>
					<CreationModal
						title="Novo banco de textos"
						handleCancel={handleCancel}
						handleCreate={handleCreate}
						showModal={showModal}
					/>
					<DataTable
						columns={getColumns(handleToGo, handleDeleteDatabase)}
						dataSource={databases}
						pages={pages}
						onChangePageNumber={getDatabases}
						onSearch={handleSearch}
						onClickButton={handleShowModal}
						textButton="Novo Banco de Textos"
						placeholderNoData={!loading ? 'Nenhum dado encontrado' : ''}
						loading={loading}
					/>
				</Layout>
			</Layout>
		</MainLayout>
	)
}

export default Databases
