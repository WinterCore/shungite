import React from "react";
import { AxiosResponse } from "axios";
import { useLocation } from "react-router";
import classnames from "classnames";
import { Button, Typography, Space, Menu, Dropdown } from "antd";
import { DownOutlined, MenuOutlined } from '@ant-design/icons';

import TwitchIcon from "../icons/Twitch";
import Api, { LOGOUT } from "../api/index";
import { SuccessResponse } from "../api/responses";
import HybirdLink from "./HybirdLink";

import { TWITCH_AUTH_URL } from "../config";

import { useUser } from "../contexts/user";

import s from "./Header.module.css";
import us from "../util.module.css";
import { User } from "../api/models";

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

type HeaderLink = {
    path  : string;
    text  : string;
    exact : boolean;
    auth  : boolean;
    mod   : boolean;
};

const links: HeaderLink[] = [
    { path: "/", text: "Home", exact: true, auth: false, mod: false },
    { path: "/emotes", text: "Emotes", exact: false, auth: false, mod: false },
    { path: "/dashboard", text: "Dashboard", exact: false, auth: true, mod: false },
    { path: "/moderation", text: "Moderation", exact: false, auth: true, mod: true },
    { path: "https://github.com/WinterCore/shungite/issues", text: "Support", exact: false, auth: false, mod: false }
];

const isVisible = ({ auth, mod }: HeaderLink, user: User | null) => {
    if (auth && !user) return false;
    if (mod && (!user || !user.isAdmin)) return false;
    return true;
};

const Header: React.FC<HeaderProps> = () => {
    const { pathname } = useLocation();
    const { user } = useUser();

    return (
        <header>
            <div className={ classnames(us.flex) }>
                <div className={ s.logo }><img src="/logo.png" alt="Logo" /></div>
                <nav className={ s.nav }>
                    {
                        links.map((link) => {
                            const { path, text, exact } = link;
                            const active = exact ? path === pathname : pathname.startsWith(path);
                            if (!isVisible(link, user)) return null;

                            return (
                                <HybirdLink
                                    key={ path }
                                    to={ path }
                                    className={ classnames(s.navLink, { [s.active]: active }) }
                                >
                                    { text }
                                </HybirdLink>
                            );
                        })
                    }
                </nav>
                <nav className={ classnames(us.flex, us.alignCenter, s.mobileNav) }>
                    <Dropdown overlay={(
                        <Menu>
                            {
                                links.map((link) => {
                                    const { path, text, exact } = link;
                                    if (!isVisible(link, user)) return null;
                                    const active = exact ? path === pathname : pathname.startsWith(path);

                                    return (
                                        <Menu.Item key={ path }>
                                            <HybirdLink
                                                key={ path }
                                                to={ path }
                                                className={ classnames(s.navLink, { [s.active]: active }) }
                                            >
                                                { text }
                                            </HybirdLink>
                                        </Menu.Item>
                                    );
                                })
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
