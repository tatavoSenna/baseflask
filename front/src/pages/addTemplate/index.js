import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Menu, Form, Button, PageHeader, Layout } from 'antd'
import {
	FormOutlined,
	NodeIndexOutlined,
	FileTextOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import {
	postTemplateAppend,
	postTemplateRequest,
	postTemplateSignersInfo,
} from '~/states/modules/postTemplate'

import BreadCrumb from '~/components/breadCrumb'
import TemplateForm from './components/form'
import Workflow from './components/workflow'
import Signers from './components/signers'
import Text from './components/text'

import styles from './index.module.scss'

function AddTemplate() {
	const { data } = useSelector(({ postTemplate }) => postTemplate)
	const { current } = useHistory().location.state
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()
	const [inputsFilled, setInputsFilled] = useState({
		form: false,
		workflow: false,
		text: false,
		signers: false,
	})

	const handleNav = (e) => {
		history.push({
			pathname: `/templates/new/`,
			state: { current: e.key },
		})
	}

	// Checks if all fields are filled (only signers fields for now)
	const validate = () => {
		let count = 0
		data.signers.parties.map((party, partyIndex) => {
			if (!party.partyTitle.length) {
				dispatch(
					postTemplateSignersInfo({
						partyIndex,
						value: party.partyTitle,
						name: 'partyTitle',
					})
				)
				count++
			}
			party.partySigners.map((signer, signerIndex) => {
				if (!signer.title.length) {
					dispatch(
						postTemplateSignersInfo({
							partyIndex,
							signerIndex,
							value: signer.title,
							name: 'title',
						})
					)
					count++
				}
				if (!signer.anchor[0].anchor_string.length) {
					dispatch(
						postTemplateSignersInfo({
							partyIndex,
							signerIndex,
							value: signer.anchor[0].anchor_string,
							name: 'anchor_string',
						})
					)
					count++
				}
				signer.fields.map((field, index) => {
					if (!field.variable.length) {
						dispatch(
							postTemplateSignersInfo({
								partyIndex,
								signerIndex,
								value: field.variable,
								name: index,
							})
						)
						count++
					}
					return null
				})
				return null
			})
			return null
		})

		if (count > 0) {
			history.push({ state: { current: 'signers' } })
			return false
		}
		return true
	}

	const onSubmit = () => {
		const isValid = validate()
		if (isValid) {
			dispatch(postTemplateRequest())
		}
	}

	const updateForm = (e, name) => {
		const value = e.target.value
		dispatch(postTemplateAppend({ name, value }))
	}

	// Each tab has a useEffect dedicated to overwatch if it is empty

	// Signers tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			signers: (() => {
				// Return true if Signers tab has at least one signer, including an empty one
				if (data.signers.parties.length > 0) {
					for (const index in data.signers.parties) {
						if (data.signers.parties[index].partySigners.length > 0) {
							return true
						}
					}
				}
				return false
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.signers])

	// Form tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			form: (() => {
				if (data.form === '') {
					return false
				}
				return true
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.form])

	// Workflow tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			workflow: (() => {
				if (data.workflow === '') {
					return false
				}
				return true
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.workflow])

	// Text tab
	useEffect(() => {
		setInputsFilled({
			...inputsFilled,
			text: (() => {
				if (data.text === '') {
					return false
				}
				return true
			})(),
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.text])

	// Set signers tab to red on mount
	useEffect(() => {
		setInputsFilled({ ...inputsFilled, signers: false })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
			<Layout className={styles.content}>
				<Form
					form={form}
					layout="horizontal"
					hideRequiredMark
					onFinish={onSubmit}>
					<Button
						key="button"
						type="primary"
						htmlType="submit"
						className={styles.button}
						disabled={!Object.values(inputsFilled).every(Boolean)}>
						Enviar
					</Button>
					{current === 'form' && (
						<TemplateForm data={data.form} updateForm={updateForm} />
					)}
					{current === 'workflow' && (
						<Workflow data={data.workflow} updateForm={updateForm} />
					)}
					{current === 'text' && (
						<Text data={data.text} updateForm={updateForm} />
					)}
					{current === 'signers' && <Signers data={data.signers} />}
				</Form>
			</Layout>
		</Layout>
	)
}

export default AddTemplate
