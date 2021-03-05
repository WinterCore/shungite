import React from "react";

import { Typography } from "antd";

import Loader from "../components/Loader";

const ApiResourceRenderer: React.FC<ApiResourceRendererProps> = ({
  isLoading,
  error,
  render,
  empty = false,
}) => {

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Typography.Title
                style={{ textAlign: "center" }}
                level={4} type="danger"
            >
                { error }
            </Typography.Title>
        );
    }

    if (empty) {
        return (
            <Typography.Title
                style={{ textAlign: "center" }}
                level={4}
            >
                No items were found!
            </Typography.Title>
        );
    }

    return render();
};

type ApiResourceRendererProps = {
  isLoading  : boolean;
  error      : string | null;
  render     : () => React.ReactElement | null;
  empty     ?: boolean;
};

export default ApiResourceRenderer;
