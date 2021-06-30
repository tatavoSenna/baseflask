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
	changeUserCompany,
} from '~/states/modules/companies'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'

function Companies() {
	const dispatch = useDispatch()
	const { companyList, loading, showModal, newCompany, pages } = useSelector(
		({ companies }) => companies
	)

	const { company_id } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getCompanyList())
	}, [dispatch, company_id])

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

	const handleChangeUserCompany = (id) => {
		dispatch(changeUserCompany({ id }))
	}

	const columns = getColumns(handleChangeUserCompany, company_id)

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
					loading={loading}
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
