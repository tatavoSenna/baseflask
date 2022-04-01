import { useEffect } from 'react'

const useFieldsValue = (form, name, inputName, value) => {
	useEffect(() => {
		if (form !== undefined && value !== undefined) {
			form.setFieldsValue({
				[name]: { [inputName]: value },
			})
		}
	}, [value, form, name, inputName])
}

export default useFieldsValue
