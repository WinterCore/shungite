import React from "react";
import queryString from "query-string";

import Select from "antd/lib/select";
import { useLocation, useHistory } from "react-router";

export type QuerySelectItem = {
    value : string;
    text  : string;
};

const QuerySelect: React.FC<QuerySelectProps> = ({ items, placeholder, queryKey, style = {}, className }) => {
    const location = useLocation();
    const history = useHistory();
    const params = queryString.parse(location.search);
    const handleChange = (v: string) => history.replace(`${location.pathname}?${queryString.stringify({ ...params, [queryKey]: v })}`);

    const value = params[queryKey]?.toString();
    
    return (
        <Select
            value={ value }
            placeholder={ placeholder }
            onChange={ handleChange }
            className={ className }
            style={ style }
        >
            { items.map(({ text, value }) => <Select.Option key={ value } value={ value }>{ text }</Select.Option>)}
        </Select>
    );
};

type QuerySelectProps = {
    items        : QuerySelectItem[];
    queryKey     : string;
    placeholder ?: string;
    style       ?: React.CSSProperties;
    className   ?: string;
};

export default QuerySelect;