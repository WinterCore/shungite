import React from "react";
import classnames from "classnames";
import { Typography, Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

import initTwitchBackgroundRenderer from "../util/twitch-background";

import us from "../util.module.css";

import "./Index.css";

import firefoxLogo from "../icons/firefox.svg";

const ExtensionMenu: React.FC = () => {
    return (
        <Menu>
            <Menu.Item icon={ <img alt="firefox" src={ firefoxLogo } /> }>
                <a target="_blank" href="https://addons.mozilla.org/en-US/firefox/addon/twitch-shungite">Firefox</a>
            </Menu.Item>
        </Menu>
    );
};

const Index: React.FC<IndexProps> = () => {
    const container = React.useRef<HTMLDivElement | null>(null);
    const canvas = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        if (!container.current || !canvas.current) return;
        const { cleanup } = initTwitchBackgroundRenderer({
            canvas     : canvas.current,
            parent     : container.current,
            logoHeight : 100,
            logoWidth  : 100,
            angle      : Math.PI / 16,
            speed      : 0.3
        });

        return cleanup;
    }, [])

    return (
        <section ref={ container } className={ classnames(us.flex, us.alignCenter, us.justifyCenter, us.fullpageContainer, "home") }>
            <canvas ref={ canvas } className="canvas" />
            <div className={ classnames("content", us.flex, us.column, us.alignCenter) }>
                <img alt="logo" className="logo" src="/logo-white.png"></img>
                <Typography.Title level={ 1 }>SHUNGITE</Typography.Title>
                <Typography.Text className="description">Enjoy custom emotes for Twitch.tv</Typography.Text>
                <Dropdown overlay={ <ExtensionMenu /> }>
                <Button>
                    Download Extension <DownOutlined />
                </Button>
            </Dropdown>
            </div>
        </section>
    );
};

interface IndexProps {}

export default Index;
