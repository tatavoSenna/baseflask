import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Menu, Form, Button, PageHeader, Layout, Spin, Row } from 'antd'
import {
	FormOutlined,
	NodeIndexOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import {
	getTemplateDetail,
	editTemplateRequest,
	editTemplateTitle,
	getTemplateDownload,
	setDocPosted,
} from '~/states/modules/editTemplate'

import BreadCrumb from '~/components/breadCrumb'
import TemplateForm from './components/form'
import Workflow from './components/workflow'
import Signers from './components/signers'
import Text from './components/text'

import styles from './index.module.scss'
import MainLayout from '~/components/mainLayout'

const EditTemplate = () => {
	const { data, loading, docPosted } = useSelector(
		({ editTemplate }) => editTemplate
	)
	const loggedUser = useSelector(({ session }) => session)
	const { id } = useHistory().location.state
	const history = useHistory()
	const edit = Number.isInteger(id)
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [current, setCurrent] = useState('form')
	const [inputsFilled, setInputsFilled] = useState({
		form: edit,
		workflow: true,
		text: edit,
		signers: true,
	})
	const [files, postFiles] = useState([])
	const [checked, setChecked] = useState(false)
	const [widgetIndexes, setWidgetIndexes] = useState(0)

	const getWidgetIndexes = (values) => {
		setWidgetIndexes(values)
	}

	const editDOCX = () => {
		setChecked(true)
		postFiles([{ uid: 'edit', name: 'Arquivo Atual' }])
	}

	const removeDoc = () => {
		dispatch(setDocPosted(false))
	}

	const handleNav = (e) => {
		setCurrent(e.key)
	}

	const handleEditTitleButton = (title) => {
		dispatch(editTemplateTitle({ title }))
	}

	const setDownloadButton = () => {
		dispatch(getTemplateDownload({ id }))
	}

	// Checks if all fields are filled (all but form tab for now)
	const validate = () => {
		const redirect = (tab) => setCurrent(tab)
		data.form.forEach((page) => {
			if (page.title === '') {
				redirect('form')
			}
		})
		data.workflow.nodes.forEach((node) => {
			if (
				node.title === '' ||
				node.responsible_group === '' ||
				node.responsible_users === []
			) {
				redirect('workflow')
				return false
			}
		})
		if (data.text === '' && !files.length) {
			redirect('text')
			return false
		}
		data.signers.parties.forEach((party) => {
			if (party.partyTitle === '') {
				redirect('signers')
				return false
			}
			party.partySigners.forEach((signer) => {
				if (signer.title === '' || signer.anchor[0].anchor_string === '') {
					redirect('signers')
					return false
				}
				signer.fields.forEach((field) => {
					if (field.variable === '') {
						redirect('signers')
						return false
					}
				})
			})
		})

		return true
	}

	const onSubmit = () => {
		const isValid = validate()
		if (isValid) {
			dispatch(editTemplateRequest({ id, files, history }))
		}
	}

	useEffect(() => {
		if (Number.isInteger(id)) {
			dispatch(getTemplateDetail({ id, editDOCX }))
		}
	}, [dispatch, id])

	// When editing an existing template, this if statement fills all fields with their respective values, fetched from the database.
	if (edit) {
		data.form.forEach((page, index) => {
			form.setFieldsValue({
				[`title_${index}`]: page.title,
			})
		})

		data.signers.parties.forEach((party, partyIndex) => {
			form.setFieldsValue({
				[`party_${partyIndex}`]: party.partyTitle,
			})
			party.partySigners.forEach((signer, signerIndex) => {
				form.setFieldsValue({
					[`title_${partyIndex}_${signerIndex}`]: signer.title,
					[`name_${partyIndex}_${signerIndex}`]: signer.fields[0].variable,
					[`email_${partyIndex}_${signerIndex}`]: signer.fields[1].variable,
					[`anchor_${partyIndex}_${signerIndex}`]:
						signer.anchor[0].anchor_string,
					[`x_offset_${partyIndex}_${signerIndex}`]:
						signer.anchor[0].anchor_x_offset,
					[`y_offset_${partyIndex}_${signerIndex}`]:
						signer.anchor[0].anchor_y_offset,
				})
			})
		})
	}

	const disabledTitleTemplate = data.title.trim().length === 0

	return (
		<MainLayout>
			{loggedUser.is_company_admin ? (
				<Layout
					style={{ padding: '0', backgroundColor: '#fff', width: '100%' }}>
					<PageHeader>
						<Row justify="space-between">
							<BreadCrumb
								parent="Modelos"
								editable={true}
								current={data.title}
								onEdit={handleEditTitleButton}
								propsSize="500px"
							/>
							<Button
								form="createTemplate"
								key="button"
								type="primary"
								htmlType="submit"
								className={styles.button}
								disabled={
									!Object.values(inputsFilled).every(Boolean) ||
									disabledTitleTemplate
								}>
								Salvar
							</Button>
						</Row>
					</PageHeader>

					<Menu
						onClick={handleNav}
						selectedKeys={[current]}
						mode="horizontal"
						style={{ display: 'flex' }}>
						<Menu.Item
							key="form"
							className={!inputsFilled.form ? styles.empty : undefined}
							icon={<FormOutlined />}>
							Formulário
						</Menu.Item>
						<Menu.Item
							key="workflow"
							className={!inputsFilled.workflow ? styles.empty : undefined}
							icon={<NodeIndexOutlined />}>
							Workflow
						</Menu.Item>
						<Menu.Item
							key="signers"
							className={!inputsFilled.signers ? styles.empty : undefined}
							icon={<TeamOutlined />}>
							Signatários
						</Menu.Item>
					</Menu>

					<Layout className={styles.content}>
						{loading ? (
							<Spin spinning={loading} className={styles.spin} />
						) : (
							<Form
								style={{ height: '100%' }}
								id="createTemplate"
								form={form}
								layout="horizontal"
								hideRequiredMark
								onFinish={onSubmit}>
								{current === 'form' && (
									<div className={styles.form}>
										<TemplateForm
											data={data}
											setInputsFilled={setInputsFilled}
											getWidgetIndexes={getWidgetIndexes}
										/>
										<Text
											data={data.text}
											files={files}
											updateFile={postFiles}
											checked={checked}
											setChecked={setChecked}
											setDownloadButton={setDownloadButton}
											setInputsFilled={setInputsFilled}
											docPosted={docPosted}
											removeDoc={removeDoc}
											widgetIndexes={widgetIndexes}
										/>
									</div>
								)}
								{current === 'workflow' && <Workflow form={form} />}
								{current === 'signers' && <Signers data={data.signers} />}
							</Form>
						)}
					</Layout>
				</Layout>
			) : (
				<h2>Você não tem permissão para acessar esse recurso.</h2>
			)}
		</MainLayout>
	)
}

export default EditTemplate
