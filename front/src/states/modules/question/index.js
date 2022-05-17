import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: [],
	visible: [],
	conditionals: [],
	currentPage: 0,
	lastPage: 0,
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'question',
	initialState,
	reducers: {
		listQuestion: (state) =>
			extend(state, {
				loading: true,
			}),
		listQuestionSuccess: (state, { payload }) => {
			const { modelId, title, parent, data } = payload
			extend(state, {
				parent,
				modelId,
				title,
				data: data.form,
				error: null,
				loading: false,
				currentPage: 0,
				lastPage: data.form.length - 1,
				visible: data.form.map((page) => {
					return page.fields.map((field) => {
						return !field.condition
					})
				}),
				conditionals: (() => {
					let variables = new Set()
					for (let page of data.form) {
						for (let field of page.fields) {
							if ('condition' in field) {
								if (Array.isArray(field.condition))
									field.condition.forEach((cond) =>
										variables.add(cond.variable)
									)
								else variables.add(field.condition.variable)
							}
						}
					}

					return [...variables]
				})(),
			})
		},
		listQuestionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		updateVisible: (state, { payload }) => {
			const compareCondition = (condition, input) => {
				const { operator, value } = condition

				let comparison
				switch (operator) {
					case '>':
						comparison = input > value
						break
					case '>=':
						comparison = input >= value
						break
					case '<':
						comparison = input < value
						break
					case '<=':
						comparison = input <= value
						break
					case '=':
						if (Array.isArray(input)) {
							comparison =
								input.length === value.length &&
								value.every((v) => input.includes(v))
						} else {
							comparison = compare(input, value, (a, b) => a === b)
						}
						break
					case '!=':
						comparison = compare(input, value, (a, b) => a !== b)
						break

					case 'contains':
						comparison =
							Array.isArray(input) &&
							Array.isArray(value) &&
							value.every((v) => input.includes(v))
						break
					default:
						comparison = false
						break
				}

				return comparison
			}

			let { form, input, subfield, fieldIndex, pageIndex } = payload
			let variableName

			if (typeof input !== 'undefined') {
				let pageFieldsData = state.data[pageIndex].fields

				// This 'if' is here so templates whose variables are not objects still work
				if (typeof pageFieldsData[fieldIndex].variable === 'string') {
					variableName = pageFieldsData[fieldIndex].variable
				} else {
					variableName = pageFieldsData[fieldIndex].variable.name
				}

				variableName = subfield
					? [variableName, subfield].join('.')
					: variableName
			}

			let visible = [...state.visible].map((pageFieldsVisible) => [
				...pageFieldsVisible,
			])

			state.data.forEach((page, pageIndex) =>
				page.fields.forEach((field, fieldIndex) => {
					if (field.condition) {
						let conditions = Array.isArray(field.condition)
							? field.condition
							: [field.condition]

						let comparison = conditions.map((condition) => {
							let value
							if (condition.variable === variableName) {
								value = input
							} else {
								let variables = condition.variable.split('.')

								value = form.getFieldValue(variables[0])
								if (variables.length === 2 && value !== undefined)
									value = value[variables[1]]
							}
							return compareCondition(condition, value)
						})
						visible[pageIndex][fieldIndex] = comparison.every((i) => i === true)
					}
				})
			)

			let lastPage = state.data.length - 1
			while (
				lastPage > 0 &&
				visible[lastPage].every((fieldVisible) => fieldVisible === false)
			) {
				lastPage--
			}

			return { ...state, visible, lastPage }
		},
		nextPage: (state) => {
			let next = state.currentPage + 1
			if (next > state.lastPage) return

			// Skip empty form pages
			if (Array.isArray(state.visible)) {
				while (
					next < state.lastPage &&
					state.visible[next].every((fieldVisible) => fieldVisible === false)
				) {
					next++
				}
			}

			extend(state, { currentPage: next })
		},
		previousPage: (state) => {
			let next = state.currentPage - 1
			if (next < 0) return

			// Skip empty form pages
			if (Array.isArray(state.visible)) {
				while (
					next > 0 &&
					state.visible[next].every((fieldVisible) => fieldVisible === false)
				) {
					next--
				}
			}

			extend(state, { currentPage: next })
		},
		setResetQuestion: (state) => {
			extend(state, {
				data: [],
				error: null,
				loading: false,
				parent: null,
				modelId: null,
				title: '',
				visible: [],
				conditionals: [],
				currentPage: 0,
				lastPage: 0,
			})
		},
	},
})

function compare(input, value, comparisonFn) {
	// If value is an array, OR logic is applied
	if (Array.isArray(value)) {
		value.forEach((item) => {
			if (comparisonFn(input, item)) {
				return true
			}
		})
	} else {
		return comparisonFn(input, value)
	}
}

export const {
	listQuestion,
	listQuestionSuccess,
	listQuestionFailure,
	updateVisible,
	nextPage,
	previousPage,
	setResetQuestion,
} = actions

export { default as questionSaga } from './sagas'

export default reducer
