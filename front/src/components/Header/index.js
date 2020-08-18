import React from 'react'
import { func, bool } from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, Menu, Dropdown } from 'antd'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    UserOutlined,
} from '@ant-design/icons'

import { logout } from '~/states/modules/session'
import { classNames } from '~/utils'

import styles from './index.module.scss'

function Head({ handleCollapsed, isCollapsed, isWeb }) {
    const history = useHistory()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout({ history }))
    }

    function getMenu() {
        return (
            <Menu style={{ zIndex: 1 }}>
                <Menu.Item
                    onClick={() => {
                        window.location.assign(
                            process.env.REACT_APP_DOCUSIGN_OAUTH_URL +
                            '/auth?response_type=code&scope=signature&client_id=' +
                            process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY +
                            '&redirect_uri=' +
                            process.env.REACT_APP_DOCUSIGN_REDIRECT_URL
                        )
                    }}>
                    Docusign connect
				</Menu.Item>
                <Menu.Item onClick={handleLogout}>Sair</Menu.Item>
            </Menu>
        )
    }

    const { Header } = Layout
    return (
        <Header
            style={{ opacity: !isWeb && !isCollapsed ? 0.5 : 1 }}
            className={classNames(styles.siteLayout, { [styles.mobile]: !isWeb })}>
            {isWeb ? (
                React.createElement(
                    isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                    {
                        className: styles.trigger,
                        onClick: () => handleCollapsed(),
                    }
                )
            ) : (
                    <div />
                )}
            <Dropdown overlay={() => getMenu()}>
                <div
                    className={classNames(styles.profile, {
                        [styles.profileMobile]: !isWeb,
                    })}>
                    <UserOutlined /> <DownOutlined />
                </div>
            </Dropdown>
        </Header>
    )
}

Head.propTypes = {
    handleCollapsed: func.isRequired,
    isCollapsed: bool.isRequired,
    isWeb: bool,
}

Head.deafultProps = {
    isWeb: true,
}

export default Head
