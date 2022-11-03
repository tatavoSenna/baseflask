import React from 'react'
import { Form, Select, Spin } from 'antd'
import styles from './index.module.scss'
import InfoField from 'components/infoField'
import { string, shape, object, func, bool, number } from 'prop-types'

const SearchSelect = ({
	pageFieldsData,
	className,
	onSearch,
	onChange,
	inputValue,
	disabled,
	visible,
	state,
}) => {
	const { loading, error, starting } = state
	const { label, variable, type, options, id, info, list, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const returnLabel = () => {
		if (label.length > 0) {
			return <InfoField label={label} info={info} />
		}
		return null
	}

	const optionsIsLoading = () => {
		return (
			<Select.Option disabled className={styles['loading']}>
				<Spin tip="Carregando dados..." />
			</Select.Option>
		)
	}

	const optionsFound = () => {
		return options.map((option, index) => (
			<Select.Option key={index} value={option.value}>
				<span className={styles['search-label']}>{option.label}</span>
			</Select.Option>
		))
	}

	const optionsNotFound = () => {
		return (
			<Select.Option disabled>
				<span className={styles['no-content']}>
					Não foi possivel encontrar os dados solicitados
				</span>
			</Select.Option>
		)
	}

	const optionsError = () => {
		return (
			<Select.Option disabled>
				<span className={styles['error']}>Erro ao fazer a busca dos dados</span>
			</Select.Option>
		)
	}

	const optionsNoContent = () => {
		return (
			<Select.Option disabled>
				<span className={styles['no-content']}>
					Digite pelo menos 3 characters para iniciar a busca
				</span>
			</Select.Option>
		)
	}

	const optionsController = () => {
		if (!starting) {
			if (!error) {
				if (loading) {
					return optionsIsLoading()
				}
				if (options.length > 0) {
					return optionsFound()
				}
				return optionsNotFound()
			}
			return optionsError()
		}
		return optionsNoContent()
	}

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={returnLabel()}
			hasFeedback
			className={`${className} ${styles['form-search']}`}
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Select
				filterOption={false}
				showSearch={true}
				loading={loading}
				allowClear={optional}
				disabled={disabled}
				onSearch={onSearch}
				onChange={onChange}>
				{optionsController()}
			</Select>
		</Form.Item>
	)
}

SearchSelect.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	form: object,
	className: string,
	onChange: func,
	inputValue: number,
	disabled: bool,
	visible: bool,
	onSearch: func,
	state: object,
}

export default SearchSelect
