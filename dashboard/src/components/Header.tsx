import React from "react";
import classnames from "classnames";
import { Button, Typography, Space, Menu, Dropdown } from "antd";

import { DownOutlined } from '@ant-design/icons';

import TwitchIcon from "../icons/Twitch";

import { TWITCH_AUTH_URL } from "../config";

import { useUser } from "../contexts/user";

import styles from "./Header.module.css";
import utilStyles from "../util.module.css";

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
            <Button
                type="primary"
                icon={ <span className="anticon"><TwitchIcon /></span> }
                size="large"
                style={{ background: "#9147FF", borderColor: "#9147FF" }}
                onClick={() => window.location.href = TWITCH_AUTH_URL}
            >
                Login
            </Button>
        );
    }

    return (
        <div className={ classnames(utilStyles.flex, utilStyles.alignCenter) }>
            <Dropdown overlay={ UserActionsMenu({ logout }) }>
                <Space size="small" style={{ cursor: "pointer" }}>
                    <img className={ styles.pfp } src={ user.picture } />
                    <Typography.Text>{ user.name }</Typography.Text>
                    <DownOutlined />
                </Space>
            </Dropdown>
        </div>
    );
};

const Header: React.FC<HeaderProps> = () => {

    return (
        <header>
            <div>
                <div className={ styles.logo }>Shungite</div>
            </div>
            <div>
                <UserCard />
            </div>
        </header>
    );
};


interface HeaderProps {}

export default Header;
