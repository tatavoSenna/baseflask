import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import TemplateModal from './components/modal'
import { getColumns } from './columns'
import {
	listTemplate,
	publishTemplate,
	favorteTemplate,
	deleteTemplate,
	setShowModal,
	duplicateTemplate,
} from '../../states/modules/templates'
import {
	resetTemplateState,
	editTemplateTitle,
} from '../../states/modules/editTemplate'
import MainLayout from '~/components/mainLayout'
import DuplicateTemplateModal from './components/duplicateTemplateModal'

const Templates = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const {
		data: templates,
		loading,
		pages,
		showModal,
	} = useSelector(({ template }) => template)

	const { company_id, is_admin } = useSelector(({ session }) => session)

	const handleCreate = (title) => {
		dispatch(setShowModal(false))
		dispatch(resetTemplateState())
		dispatch(editTemplateTitle({ title }))
		return history.push({
			pathname: `/templates/new/`,
			state: { id: 'new' },
		})
	}

	const handleToGo = (template) =>
		history.push({
			pathname: `templates/edit`,
			state: { id: template.id },
		})

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handlePublishTemplate = (template, status) => {
		dispatch(publishTemplate({ id: template.id, status: status }))
	}

	const handleFavoriteTemplate = (template, status) => {
		dispatch(favorteTemplate({ id: template, status: status }))
	}

	const [showDuplicateModal, setShowDuplicateModal] = useState(false)
	const [idTemplate, setIdTemplate] = useState({})

	const handleDuplicateTemplate = (template, targetId) => {
		dispatch(
			duplicateTemplate({
				id: template.id,
				companyId: company_id,
				pages,
				targetId,
			})
		)
		if (is_admin && showDuplicateModal) setShowDuplicateModal(false)
	}

	const handleOpenModal = (template) => {
		if (is_admin) {
			setShowDuplicateModal(true)
			setIdTemplate(template)
		} else {
			handleDuplicateTemplate(template, company_id)
		}
	}

	const handleDeleteTemplate = (template) =>
		dispatch(deleteTemplate({ id: template.id, pages }))

	const getTemplates = ({ page, perPage, search }) =>
		dispatch(listTemplate({ page, perPage, search }))

	const handleSearch = ({ page, perPage, search }) =>
		dispatch(listTemplate({ page, perPage, search }))

	useEffect(() => {
		dispatch(listTemplate())
	}, [dispatch])

	return (
		<MainLayout>
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
					<DuplicateTemplateModal
						showModal={showDuplicateModal}
						handleCancel={() => setShowDuplicateModal(false)}
						currentCompany={company_id}
						handleDuplicate={handleDuplicateTemplate}
						template={idTemplate}
					/>
					<DataTable
						columns={getColumns(
							handleToGo,
							handlePublishTemplate,
							handleDeleteTemplate,
							handleFavoriteTemplate,
							handleOpenModal,
							is_admin
						)}
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
		</MainLayout>
	)
}

export default Templates
