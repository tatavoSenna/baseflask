import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Menu, Form, Button, PageHeader, Layout, Spin } from 'antd'
import {
	FormOutlined,
	NodeIndexOutlined,
	FileTextOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import {
	getTemplateDetail,
	postTemplateRequest,
} from '~/states/modules/postTemplate'

import BreadCrumb from '~/components/breadCrumb'
import TemplateForm from './components/form'
import Workflow from './components/workflow'
import Signers from './components/signers'
import Text from './components/text'

import styles from './index.module.scss'

const EditTemplate = () => {
	const { data, loading } = useSelector(({ postTemplate }) => postTemplate)
	const { id } = useHistory().location.state
	const history = useHistory()
	const edit = Number.isInteger(id)
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [current, setCurrent] = useState('form')
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

	const handleNav = (e) => {
		setCurrent(e.key)
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
			dispatch(postTemplateRequest({ id, files, history }))
		}
	}

	// Each tab (except for signers, which is optional) has a useEffect dedicated to check if it is empty, thus determining their color

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

	// Workflow tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			workflow: (() => {
				if (data.workflow.nodes.length > 0) {
					return true
				}
				return false
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.workflow.nodes])

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
				<BreadCrumb parent="Templates" current={data.title} />
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
						{current === 'workflow' && <Workflow data={data.workflow} />}
						{current === 'text' && (
							<Text
								data={data.text}
								files={files}
								updateFile={postFiles}
								checked={checked}
								setChecked={setChecked}
								setInputsFilled={setInputsFilled}
								inputsFilled={inputsFilled}
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
