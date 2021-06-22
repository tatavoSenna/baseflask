import React, { useEffect } from 'react'
import { Layout, PageHeader } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import CompanyModal from './components/modal'
import { getColumns } from './columns'
import {
	getCompanyList,
	setShowModal,
	addCompany,
	updateNewCompany,
} from '~/states/modules/companies'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'

function Companies() {
	const dispatch = useDispatch()
	const { companyList, loading, showModal, newCompany, pages } = useSelector(
		({ companies }) => companies
	)

	const { loggedUser } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getCompanyList())
	}, [dispatch, loggedUser])

	const getCompanies = ({ page, perPage, search }) =>
		dispatch(getCompanyList({ page, perPage, search }))

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handleSearch = (searchInput) => {
		dispatch(getCompanyList(searchInput))
	}

	const handleAdd = (form) => {
		dispatch(addCompany())
		dispatch(setShowModal(false))
		form.resetFields()
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleNewCompany = (form) => {
		dispatch(updateNewCompany(form.getFieldsValue()))
	}

	const columns = getColumns()

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			<PageHeader>
				<BreadCrumb parent="Empresas" current="Lista" />
			</PageHeader>
			<Layout style={{ backgroundColor: '#fff' }}>
				<CompanyModal
					handleCancel={handleCancel}
					handleAdd={handleAdd}
					handleNewCompany={handleNewCompany}
					showModal={showModal}
					newCompany={newCompany}
				/>

				<DataTable
					dataSource={companyList}
					columns={columns}
					loading={loading || !loggedUser}
					pages={pages}
					onChangePageNumber={getCompanies}
					onSearch={handleSearch}
					onClickButton={handleShowModal}
					textButton="+ Empresa "
					placeholderNoData={!loading ? 'Nenhuma empresa encontrada' : ''}
				/>
			</Layout>
		</Layout>
	)
}

export default Companies
