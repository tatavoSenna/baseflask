import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Menu, Form, Button, PageHeader, Layout, Spin, Input } from 'antd'
import {
	FormOutlined,
	NodeIndexOutlined,
	FileTextOutlined,
	TeamOutlined,
	EditOutlined,
	CheckOutlined,
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

const EditTemplate = () => {
	const { data, loading, docPosted } = useSelector(
		({ editTemplate }) => editTemplate
	)
	const { id } = useHistory().location.state
	const history = useHistory()
	const edit = Number.isInteger(id)
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [current, setCurrent] = useState('form')
	const [editTitle, setEditTitle] = useState(false)
	const [inputsFilled, setInputsFilled] = useState({
		form: edit,
		workflow: edit,
		text: edit,
		signers: edit,
	})
	const [files, postFiles] = useState([])
	const [checked, setChecked] = useState(false)

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

	const handleEditTitle = (e) => {
		const title = e.target.value
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

	// Each tab (except for signers and workflow, which are optional) has a useEffect dedicated to check if it is empty, thus determining their color

	// Form tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			form: (() => {
				if (data.form.length > 0) {
					return true
				}
				return false
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.form])

	// Text tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			text: (() => {
				if (data.text === '' && !files.length) {
					return false
				}
				return true
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.text, files])

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

		data.workflow.nodes.forEach((node, index) =>
			form.setFieldsValue({
				[`description_${index}`]: node.title,
				[`group_${index}`]: node.responsible_group,
				[`users_${index}`]: node.responsible_users,
				[`deadline_${index}`]: node.deadline,
			})
		)

		data.signers.parties.forEach((party, partyIndex) => {
			form.setFieldsValue({
				[`party_${partyIndex}`]: party.partyTitle,
			})
			party.partySigners.forEach((signer, signerIndex) => {
				form.setFieldsValue({
					[`title_${partyIndex}_${signerIndex}`]: signer.title,
					[`name_${partyIndex}_${signerIndex}`]: signer.fields[0].variable,
					[`email_${partyIndex}_${signerIndex}`]: signer.fields[1].variable,
					[`anchor_${partyIndex}_${signerIndex}`]: signer.anchor[0]
						.anchor_string,
					[`x_offset_${partyIndex}_${signerIndex}`]: signer.anchor[0]
						.anchor_x_offset,
					[`y_offset_${partyIndex}_${signerIndex}`]: signer.anchor[0]
						.anchor_y_offset,
				})
			})
		})
	}

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			<PageHeader>
				<BreadCrumb
					parent="Templates"
					current={
						editTitle ? (
							<>
								<Input
									style={{ maxWidth: '300px' }}
									value={data.title}
									onChange={(e) => handleEditTitle(e)}
								/>
								<Button
									onClick={() => setEditTitle(false)}
									icon={<CheckOutlined style={{ fontSize: '18px' }} />}
									style={{ border: 'none', marginLeft: '5px' }}
								/>
							</>
						) : (
							<>
								{data.title}
								<Button
									onClick={() => setEditTitle(true)}
									icon={<EditOutlined style={{ fontSize: '18px' }} />}
									style={{ border: 'none', marginLeft: '5px' }}
								/>
							</>
						)
					}
				/>
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
					key="text"
					className={!inputsFilled.text ? styles.empty : undefined}
					icon={<FileTextOutlined />}>
					Texto
				</Menu.Item>
				<Menu.Item
					key="signers"
					className={!inputsFilled.signers ? styles.empty : undefined}
					icon={<TeamOutlined />}>
					Assinantes
				</Menu.Item>
			</Menu>
			<Button
				form="createTemplate"
				key="button"
				type="primary"
				htmlType="submit"
				className={styles.button}
				disabled={!Object.values(inputsFilled).every(Boolean)}>
				Enviar
			</Button>
			<Layout className={styles.content}>
				{loading ? (
					<Spin spinning={loading} className={styles.spin} />
				) : (
					<Form
						id="createTemplate"
						form={form}
						layout="horizontal"
						hideRequiredMark
						onFinish={onSubmit}>
						{current === 'form' && <TemplateForm data={data.form} />}
						{current === 'workflow' && (
							<Workflow
								data={data.workflow}
								inputsFilled={inputsFilled}
								setInputsFilled={setInputsFilled}
							/>
						)}
						{current === 'text' && (
							<Text
								data={data.text}
								files={files}
								updateFile={postFiles}
								checked={checked}
								setChecked={setChecked}
								setDownloadButton={setDownloadButton}
								setInputsFilled={setInputsFilled}
								inputsFilled={inputsFilled}
								docPosted={docPosted}
								removeDoc={removeDoc}
							/>
						)}
						{current === 'signers' && (
							<Signers
								data={data.signers}
								inputsFilled={inputsFilled}
								setInputsFilled={setInputsFilled}
							/>
						)}
					</Form>
				)}
			</Layout>
		</Layout>
	)
}

export default EditTemplate
