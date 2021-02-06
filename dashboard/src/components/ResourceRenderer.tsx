import React from 'react';

import { Typography } from "antd";

import Loader from "../components/Loader";

const ApiResourceRenderer: React.FC<ApiResourceRendererProps> = ({
  isLoading,
  error,
  empty,
  render,
}) => {

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <Typography.Title level={4} type="danger">Something happened!</Typography.Title>;
    }

    if (empty) {
        return <Typography.Title level={4}>No items were found!</Typography.Title>;
    }

    return render();
};

type ApiResourceRendererProps = {
  isLoading   : boolean;
  error?      : string | null;
  empty       : boolean;
  render      : () => React.ReactElement | null;
};

export default ApiResourceRenderer;
