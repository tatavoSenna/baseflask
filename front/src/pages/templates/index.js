import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import TemplateModal from './components/modal'
import { getColumns } from './columns'
import { listTemplate, setShowModal } from '../../states/modules/templates'
import { postTemplateTitle } from '../../states/modules/postTemplate'

const Templates = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const { data: templates, loading, pages, showModal } = useSelector(
		({ template }) => template
	)

	const handleCreate = (title) => {
		dispatch(setShowModal(false))
		dispatch(postTemplateTitle({ title }))
		return history.push({
			pathname: `/templates/new/`,
			state: { current: 0 },
		})
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

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
				<TemplateModal
					handleCancel={handleCancel}
					handleCreate={handleCreate}
					showModal={showModal}
				/>
				<DataTable
					columns={getColumns()}
					dataSource={templates}
					pages={pages}
					onChangePageNumber={getTemplates}
					onSearch={handleSearch}
					onClickButton={handleShowModal}
					textButton="Novo Template"
					placeholderNoData={!loading ? 'Nenhum template encontrado' : ''}
					loading={loading}
				/>
			</Layout>
		</Layout>
	)
}

export default Templates
