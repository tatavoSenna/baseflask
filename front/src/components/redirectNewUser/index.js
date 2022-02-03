import { useEffect } from 'react'
import { node } from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

function RedirectNewUser({ children }) {
	let history = useHistory()
	let loggedUser = useSelector(({ session }) => session)

	useEffect(() => {
		if (!loggedUser.created) {
			history.push('/')
		}
	}, [loggedUser, history])

	return loggedUser.created ? children : null
}

RedirectNewUser.propTypes = {
	children: node.isRequired,
}

export default RedirectNewUser
