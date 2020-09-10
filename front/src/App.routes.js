import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import AdminRoute from './services/AdminRoutes'

import Token from './pages/token'
import Contracts from './pages/contracts'
import AddContract from './pages/addContract'
import DocusignToken from './pages/docusignToken'

import Wrapper from '~/components/wrapper'

export const ROUTES = {
	token: '/token',
	home: '/',
	contracts: '/contracts',
	addContract: '/addContracts',
	form: '/form/:current',
	docusignToken: '/docusign-token',
}

function Routes() {
	return (
		<Router>
			<Switch>
				<AdminRoute path={ROUTES.token} component={Token} />
				<AdminRoute
					path={ROUTES.docusignToken}
					component={DocusignToken}
					isPrivate
				/>
				<Wrapper>
					<AdminRoute
						exact
						path={ROUTES.home}
						component={Contracts}
						isPrivate
					/>
					<AdminRoute
						exact
						path={ROUTES.form}
						component={AddContract}
						isPrivate
					/>
				</Wrapper>
			</Switch>
		</Router>
	)
}

export default Routes
