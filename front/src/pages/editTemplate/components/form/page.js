import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { object, array, number, func } from 'prop-types'
import { Card, Form, Input, Button, Dropdown, Menu, Empty } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import Delete from '~/components/deleteConfirm'
import {
	editTemplateFieldAdd,
	editTemplateFormInfo,
} from '~/states/modules/editTemplate'
import { JSONWidget } from './widgets/jsonWidget'
import { TextWidget } from './widgets/textWidget'
import { NumberWidget } from './widgets/numberWidget'
import { CurrencyWidget } from './widgets/currencyWidget'
import { DateWidget } from './widgets/dateWidget'
import { EmailWidget } from './widgets/emailWidget'
import { CheckboxWidget } from './widgets/checkboxWidget'
import { RadioWidget } from './widgets/radioWidget'
import { TimeWidget } from './widgets/timeWidget'
import { DropdownWidget } from './widgets/dropdownWidget'
import { BankWidget } from './widgets/bankWidget'
import { AddressWidget } from './widgets/addressWidget'
import { DatabaseWidget } from './widgets/databaseWidget'
import { CnaeWidget } from './widgets/cnaeWidget'
import { CpfWidget } from './widgets/CpfWidget'
import { CnpjWidget } from './widgets/CnpjWidget'
import { ParagraphWidget } from './widgets/paragraphWidget'
import { SeparatorWidget } from './widgets/separatorWidget'
import { PersonWidget } from './widgets/personWidget'

const widgets = {
	text: TextWidget,
	text_area: ParagraphWidget,
	currency: CurrencyWidget,
	number: NumberWidget,
	cpf: CpfWidget,
	cnpj: CnpjWidget,
	date: DateWidget,
	email: EmailWidget,
	checkbox: CheckboxWidget,
	radio: RadioWidget,
	time: TimeWidget,
	dropdown: DropdownWidget,
	bank: BankWidget,
	address: AddressWidget,
	person: PersonWidget,
	database: DatabaseWidget,
	cnae: CnaeWidget,
	separator: SeparatorWidget,
}

const Page = ({ pageIndex, data, variables, handleRemovePage }) => {
	const dispatch = useDispatch()

	const fieldTypes = (
		<Menu onClick={(value) => handleAddField(value.key)}>
			<Menu.Item key="text">Texto</Menu.Item>
			<Menu.Item key="text_area">Parágrafo</Menu.Item>
			<Menu.Item key="number">Número</Menu.Item>
			<Menu.Item key="cpf">CPF</Menu.Item>
			<Menu.Item key="cnpj">CNPJ</Menu.Item>
			<Menu.Item key="email">Email</Menu.Item>
			<Menu.Item key="date">Data</Menu.Item>
			<Menu.Item key="time">Hora</Menu.Item>
			<Menu.Item key="currency">Moeda</Menu.Item>
			<Menu.Item key="bank">Banco</Menu.Item>
			<Menu.Item key="cnae">CNAE</Menu.Item>
			<Menu.Item key="dropdown">Dropdown</Menu.Item>
			<Menu.Item key="radio">Rádio</Menu.Item>
			<Menu.Item key="checkbox">Checkbox</Menu.Item>
			<Menu.Item key="variable_image">Upload de imagem</Menu.Item>
			<Menu.Item key="database">API</Menu.Item>
			<Menu.Item key="person">Pessoa</Menu.Item>
			<Menu.Item key="address">Endereço</Menu.Item>
			<Menu.Item key="structured_list">Lista Estruturada</Menu.Item>
			<Menu.Item key="separator">Separador</Menu.Item>
		</Menu>
	)

	const handleAddField = (type) => {
		let newField = {
			type: `${type}`,
			label: '',
			info: '',
			variable: {
				name: '',
			},
			initialValue: '',
			optional: false,
		}

		switch (type) {
			case 'time':
				newField.variable.type = 'time'
				newField.minute_step = ''
				break
			case 'number':
				newField.variable.type = 'number'
				newField.variable.doc_display_style = 'plain | extended | ordinal'
				newField.decimals = ''
				newField.min = ''
				newField.max = ''
				newField.step = ''
				break
			case 'date':
				newField.variable.type = 'date'
				newField.variable.doc_display_style = '%d/%m/%Y | extended'
				break
			case 'checkbox':
				newField.variable.type = 'list'
				newField.variable.doc_display_style = 'commas | bullets'
				break
			case 'currency':
				newField.initialValue = 0
				newField.variable.type = 'currency'
				newField.variable.doc_display_style = 'plain | extended'
				break
			case 'database':
				newField.variable.type = 'database'
				newField.variable.database_endpoint = ''
				newField.variable.search_key = ''
				newField.variable.display_key = ''
				break
			case 'variable_image':
				newField.variable.type = 'variable_image'
				newField.variable.doc_display_style = 'image'
				newField.variable.width = 8.0
				break
			case 'person':
				newField.variable.type = 'person'
				newField.label = ''
				newField.person_type = ['legal_person', 'natural_person']
				newField.fields = [
					'nationality',
					'cpf',
					'pronoun',
					'name',
					'surname',
					'identity',
					'identity_org',
					'identity_date',
					'email',
					'marital_state',
					'property_regime',
					'profession',
					'legal_nationality',
					'cnpj',
					'society_name',
					'activity',
					'cep',
					'country',
					'number',
					'street',
					'complement',
					'state',
					'district',
					'city',
					'attorney_nationality',
					'attorney_cpf',
					'attorney_pronoun',
					'attorney_name',
					'attorney_surname',
					'attorney_identity',
					'attorney_identity_org',
					'attorney_identity_date',
					'attorney_email',
					'attorney_profession',
					'attorney_cep',
					'attorney_country',
					'attorney_number',
					'attorney_street',
					'attorney_complement',
					'attorney_state',
					'attorney_district',
					'attorney_city',
				]
				newField.initialValue = newField.fields.reduce(
					(a, field) => ({ ...a, [field]: '' }),
					{ person_type: '' }
				)

				delete newField['info']
				break
			case 'address':
				newField.variable.type = 'address'
				newField.label = ''
				newField.fields = [
					'cep',
					'country',
					'number',
					'street',
					'complement',
					'district',
					'state',
					'city',
				]

				newField.initialValue = newField.fields.reduce(
					(a, field) => ({ ...a, [field]: '' }),
					{}
				)

				delete newField['info']
				break
			case 'structured_list':
				newField.variable.type = type
				newField.variable.doc_display_style = 'text'
				newField.variable.extra_style_params = {
					row_template: '',
					separator: '',
				}
				newField.structure = [
					{
						type: 'text',
						label: '',
						info: '',
						variable: {
							name: '',
							type: '',
							doc_display_style: '',
						},
					},
				]
				break
			case 'structured_checkbox':
				newField.variable.type = type
				newField.variable.doc_display_style = 'text'
				newField.variable.extra_style_params = {
					row_template: '',
					separator: '',
				}
				newField.structure = [
					{
						type: 'text',
						label: '',
						info: '',
						variable: {
							name: '',
							type: '',
							doc_display_style: '',
						},
					},
				]
				break
			case 'separator':
				newField = {
					type: 'separator',
					title: '',
				}
				break
			case 'text':
				newField.placeholder = ''
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
			case 'text_area':
				newField.placeholder = ''
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
			default:
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
		}

		const hasOptions = ['dropdown', 'radio', 'checkbox', 'structured_checkbox']
		if (hasOptions.includes(type)) {
			newField.options = [
				{ label: '', value: '' },
				{ label: '', value: '' },
				{ label: '', value: '' },
			]
		}

		dispatch(editTemplateFieldAdd({ newField, pageIndex }))
	}

	const updateFormInfo = useCallback(
		(value, name, pageIndex, fieldIndex) => {
			dispatch(editTemplateFormInfo({ value, name, pageIndex, fieldIndex }))
		},
		[dispatch]
	)

	return (
		<Card
			style={{
				marginBottom: '1rem',
				marginTop: '2rem',
				maxWidth: '40rem',
				boxShadow: '0 1px 4px 0 rgba(192, 208, 230, 0.8)',
				borderRadius: '5px',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '24px',
				}}>
				<Form.Item
					name={`title_${pageIndex}`}
					label="Título"
					style={{ width: '50%', margin: '0 0 0 8px' }}
					onChange={(e) => updateFormInfo(e.target.value, 'title', pageIndex)}
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
					<Input autoFocus value={data.title} />
				</Form.Item>
				<Delete
					title="Deseja excluir esse esse conjunto de campos?"
					handle={() => handleRemovePage(pageIndex)}
				/>
			</div>
			{!data.fields.length ? (
				<Empty description="Sem Campos" style={{ marginBottom: '1rem' }} />
			) : (
				data.fields.map((field, fieldIndex) => {
					const el = field?.type in widgets ? widgets[field.type] : JSONWidget
					const props = {
						key: data.ids[fieldIndex],
						data: field,
						variables,
						pageIndex,
						fieldIndex,
						updateFormInfo,
					}

					return React.createElement(el, props)
				})
			)}
			<Dropdown overlay={fieldTypes} trigger="click">
				<Button
					type="primary"
					icon={<PlusOutlined />}
					style={{
						display: 'inline-block',
						float: 'right',
					}}>
					Novo Campo
					<DownOutlined />
				</Button>
			</Dropdown>
		</Card>
	)
}

export default Page

Page.propTypes = {
	data: object,
	variables: array,
	pageIndex: number,
	handleRemovePage: func,
}
