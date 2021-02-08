import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { Card } from "antd";

import { EmoteSnippet } from "../api/models";
import { EMOTE_ASSET_URL, EMOTE_SIZES } from "../config";

import us from "../util.module.css";

const EmoteCard: React.FC<EmoteCardProps> = ({ id, keyword }) => {
    const w = EMOTE_SIZES.x3;
    const Img = (
        <div className={ classnames(us.flex, us.justifyCenter, us.emoteImage) }>
            <img alt={ keyword } src={ EMOTE_ASSET_URL(id, "x3") } style={{ width: w }} />
        </div>
    );

    return (
        <Link to={`/emotes/${ id }`}>
            <Card
                style={{ height: "100%" }}
                cover={ Img }
                className={ classnames(us.emoteCard, us.flex, us.column, us.justifyBetween) }
                hoverable
            >
                <Card.Meta style={{ textAlign: "center" }} title={ keyword }>{ keyword }</Card.Meta>
            </Card>
        </Link>
    );
};


interface EmoteCardProps extends EmoteSnippet {}

export default EmoteCard;
