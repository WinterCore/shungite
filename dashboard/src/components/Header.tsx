import React from "react";
import { useLocation } from "react-router";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { Button, Typography, Space, Menu, Dropdown } from "antd";

import { DownOutlined } from '@ant-design/icons';

import TwitchIcon from "../icons/Twitch";

import { TWITCH_AUTH_URL } from "../config";

import { useUser } from "../contexts/user";

import s from "./Header.module.css";
import us from "../util.module.css";

const UserActionsMenu = ({ logout }: { logout: () => void }) => {
    return (
        <Menu>
            <Menu.Item onClick={ logout }>
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
];

const Header: React.FC<HeaderProps> = () => {
    const { pathname } = useLocation();
    const { user } = useUser();

    return (
        <header>
            <div className={ classnames(us.flex) }>
                <div className={ s.logo }><img src="/logo.png" /></div>
                <nav>
                    {
                        links.map(({ path, text, exact, auth }) => {
                            const active = exact ? path === pathname : pathname.startsWith(path);
                            if (auth && !user) return null;

                            return (
                                <Link
                                    key={ path }
                                    className={ classnames(s.navLink, { [s.active]: active }) }
                                    to={ path }
                                >
                                    { text }
                                </Link>
                            );
                        })
                    }
                </nav>
            </div>
            <UserCard />
        </header>
    );
};


interface HeaderProps {}

export default Header;
