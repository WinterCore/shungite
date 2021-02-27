import React from "react";
import { Redirect, RouteComponentProps } from "react-router";

import { useUser } from "../contexts/user";

const Authenticated: React.FC<AuthenticatedProps> = ({ component: Component, ...props }) => {
    const { user } = useUser();
    if (!user) return <Redirect to="/" />;

    return <Component { ...props } />
};

interface AuthenticatedProps extends RouteComponentProps {
    component: React.FC<any>;
}
export default Authenticated;
