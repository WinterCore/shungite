import React from "react";
import { Tabs, Empty } from "antd";
import { PlusOutlined, ShareAltOutlined, UploadOutlined } from "@ant-design/icons";

import { Emotes } from "../components/EmotesResource";

import { GetUserResponse } from "../api/responses";
import { GET_USER } from "../api/index";
import ApiResourceRenderer from "../components/ResourceRenderer";

import { useUser } from "../contexts/user";
import useApi from "../hooks/api";
import EmoteForm from "../components/EmoteForm";

const { TabPane } = Tabs;

const Dashboard: React.FC<DashboardProps> = (props) => {
    const { public_emotes, uploaded_emotes } = props.data.data;

    return (
        <Tabs style={{ background: "#FFF", padding: "20px" }}>
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
    );
};

const DashboardRenderer: React.FC = () => {
    const { user } = useUser();

    const { data, error, isLoading, reload } = useApi<GetUserResponse>(GET_USER(user!.username), [], true);

    const handleReload = () => reload();

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
