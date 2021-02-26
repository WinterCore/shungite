import React from "react";
import classnames from "classnames";
import { Tabs, Empty } from "antd";
import { PlusOutlined, ShareAltOutlined, UploadOutlined } from "@ant-design/icons";

import { Emotes } from "../components/EmotesResource";

import { GetUserResponse } from "../api/responses";
import { GET_USER } from "../api/index";
import ApiResourceRenderer from "../components/ResourceRenderer";

import { useUser } from "../contexts/user";
import useApi from "../hooks/api";
import EmoteForm from "../components/EmoteForm";

import us from "../util.module.css";

const { TabPane } = Tabs;

const Dashboard: React.FC<DashboardProps> = (props) => {
    const { public_emotes, uploaded_emotes } = props.data.data;

    return (
        <section className={ classnames(us.flex, us.justifyCenter) }>
            <Tabs className={ us.responsiveContainer } style={{ padding: "20px" }}>
                <TabPane tab={ <span><PlusOutlined /> Create Emote</span> } key="1">
                    <EmoteForm reloadEmotes={ props.reload } />
                </TabPane>
                <TabPane tab={ <span><UploadOutlined /> Uploaded Emotes</span> } key="2">
                    {uploaded_emotes.length > 0
                        ? <Emotes emotes={ uploaded_emotes } />
                        : <Empty />
                    }
                </TabPane>
                <TabPane tab={ <span><ShareAltOutlined /> Public Emotes</span> } key="3">
                    {public_emotes.length > 0
                        ? <Emotes emotes={ public_emotes } />
                        : <Empty />
                    }
                </TabPane>
            </Tabs>
        </section>
    );
};

const DashboardRenderer: React.FC = () => {
    const { user } = useUser();

    const { data, error, isLoading } = useApi<GetUserResponse>(GET_USER(user!.username), [], true);

    const handleReload = () => null;

    return (
        <ApiResourceRenderer
            isLoading={ isLoading }
            error={ error }
            render={ () => <Dashboard reload={ handleReload } data={ data! } /> }
        />
    );
};

interface DashboardProps {
    data   : GetUserResponse;
    reload : () => void;
}

export default DashboardRenderer;
