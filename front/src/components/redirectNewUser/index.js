import { node } from 'prop-types'
import { useSelector } from 'react-redux'

function RedirectNewUser({ children }) {
	// let history = useHistory()
	let loggedUser = useSelector(({ session }) => session)

	// TODO: Removed for causing a state loop. It can probablu be removed forever.
	// useEffect(() => {
	// 	if (!loggedUser.created) {
	// 		history.push('/')
	// 	}
	// }, [loggedUser, history])

	return loggedUser.created ? children : null
}

RedirectNewUser.propTypes = {
	children: node.isRequired,
}

export default RedirectNewUser
