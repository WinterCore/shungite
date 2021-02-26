import React from "react";
import { AxiosResponse } from "axios";
import { useLocation } from "react-router";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { Button, Typography, Space, Menu, Dropdown } from "antd";
import { DownOutlined, MenuOutlined } from '@ant-design/icons';

import TwitchIcon from "../icons/Twitch";
import Api, { LOGOUT } from "../api/index";
import { SuccessResponse } from "../api/responses";

import { TWITCH_AUTH_URL } from "../config";

import { useUser } from "../contexts/user";

import s from "./Header.module.css";
import us from "../util.module.css";

const UserActionsMenu = ({ logout }: { logout: () => void }) => {
    const handleLogout = () => {
        Api(LOGOUT())
            .then((_: AxiosResponse<SuccessResponse>) => logout());
    };

    return (
        <Menu>
            <Menu.Item onClick={ handleLogout }>
                Logout
            </Menu.Item>
        </Menu>
    );
};

const UserCard: React.FC = () => {
    const { user, logout } = useUser();

    if (!user) {
        return (
            <div className={ classnames(us.flex, us.alignCenter) }>
                <Button
                    type="primary"
                    icon={ <span className="anticon"><TwitchIcon /></span> }
                    size="large"
                    style={{ background: "#9147FF", borderColor: "#9147FF" }}
                    onClick={() => window.location.href = TWITCH_AUTH_URL}
                >
                    Login
                </Button>
            </div>
        );
    }

    return (
        <div className={ classnames(us.flex, us.alignCenter) }>
            <Dropdown overlay={ UserActionsMenu({ logout }) }>
                <Space size="small" style={{ cursor: "pointer" }}>
                    <img alt={ user.name } className={ s.pfp } src={ user.picture } />
                    <Typography.Text>{ user.name }</Typography.Text>
                    <DownOutlined />
                </Space>
            </Dropdown>
        </div>
    );
};

const links = [
    { path: "/", text: "Home", exact: true, auth: false },
    { path: "/emotes", text: "Emotes", exact: false, auth: false },
    { path: "/dashboard", text: "Dashboard", exact: false, auth: true },
    { path: "https://github.com/WinterCore/shungite/issues", text: "Support", exact: false, auth: false }
];

const Header: React.FC<HeaderProps> = () => {
    const { pathname } = useLocation();
    const { user } = useUser();

    return (
        <header>
            <div className={ classnames(us.flex) }>
                <div className={ s.logo }><img src="/logo.png" alt="Logo" /></div>
                <nav className={ s.nav }>
                    {
                        links.map(({ path, text, exact, auth }) => {
                            const active = exact ? path === pathname : pathname.startsWith(path);
                            if (auth && !user) return null;

                            return (
                                path.startsWith("http")
                                    ? (
                                        <a rel="noreferrer" target="_blank" href={ path } key={ path } className={ s.navLink }>{ text }</a>
                                    ) : (
                                        <Link
                                            key={ path }
                                            className={ classnames(s.navLink, { [s.active]: active }) }
                                            to={ path }
                                        >
                                            { text }
                                        </Link>
                                    )
                            );
                        })
                    }
                </nav>
                <nav className={ classnames(us.flex, us.alignCenter, s.mobileNav) }>
                    <Dropdown overlay={(
                        <Menu>
                            {
                                links.map(({ path, text }) => (
                                    <Menu.Item key={ path }>
                                        {

                                            path.startsWith("http")
                                                ? <a rel="noreferrer" target="_blank" href={ path } key={ path }>{ text }</a>
                                                : <Link to={ path }>{ text }</Link>
                                        }
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    )}>
                        <Button>
                            <MenuOutlined />
                        </Button>
                    </Dropdown>
                </nav>
            </div>
            <UserCard />
        </header>
    );
};


interface HeaderProps {}

export default Header;
