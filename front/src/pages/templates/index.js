import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, PageHeader } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import { getColumns } from './columns'
import { listTemplate } from '../../states/modules/templates'

const Templates = () => {
	const dispatch = useDispatch()
	const { data: templates, loading, pages } = useSelector(
		({ template }) => template
	)

	const getTemplates = ({ page, perPage, search }) =>
		dispatch(listTemplate({ page, perPage, search }))

	const handleSearch = ({ page, perPage, search }) =>
		dispatch(listTemplate({ page, perPage, search }))

	useEffect(() => {
		dispatch(listTemplate())
	}, [dispatch])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			<PageHeader>
				<BreadCrumb parent="Templates" current="Lista" />
			</PageHeader>
			<Layout style={{ backgroundColor: '#fff' }}>
				<DataTable
					columns={getColumns()}
					dataSource={templates}
					pages={pages}
					onChangePageNumber={getTemplates}
					onSearch={handleSearch}
					onClickButton={() => {}}
					textButton="Novo Template"
					placeholderNoData={!loading ? 'Nenhum template encontrado' : ''}
					loading={loading}
				/>
			</Layout>
		</Layout>
	)
}

export default Templates
