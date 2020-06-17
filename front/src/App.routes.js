import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import AdminRoute from './services/AdminRoutes'

import Login from './pages/login'
import Home from './pages/home'
import Contracts from './pages/contracts'
import AddContract from './pages/addContract'

import Wrapper from '~/components/wrapper'

export const ROUTES = {
	login: '/login',
	home: '/',
	contracts: '/contracts',
	addContract: '/addContracts',
}

function Routes() {
	return (
		<Router>
			<Switch>
				<AdminRoute path={ROUTES.login} component={Login} />
				<Wrapper>
					<AdminRoute exact path={ROUTES.home} component={Home} isPrivate />
					<AdminRoute
						exact
						path={ROUTES.contracts}
						component={Contracts}
						isPrivate
					/>
					<AdminRoute
						exact
						path={ROUTES.addContract}
						component={AddContract}
						isPrivate
					/>
				</Wrapper>
			</Switch>
		</Router>
	)
}

export default Routes
