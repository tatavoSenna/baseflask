import { Button } from 'antd'
import React from 'react'
import propTypes from 'prop-types'

const FormPortal = ({ onSubmitStripe, priceId }) => {
	return (
		<form onSubmit={onSubmitStripe}>
			<Button
				disabled={priceId === null ? true : false}
				id="checkout-and-portal-button"
				type="primary"
				htmlType="submit"
			>
				Gerenciar assinara
			</Button>
		</form>
	)
}

FormPortal.propTypes = {
	onSubmitStripe: propTypes.func,
	priceId: propTypes.string,
}

export default FormPortal
