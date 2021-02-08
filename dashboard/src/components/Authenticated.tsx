import React from "react";
import { Redirect } from "react-router";

import { useUser } from "../contexts/user";

const Authenticated: React.FC<AuthenticatedProps> = ({ component: Component, ...props }) => {
    const { user } = useUser();
    if (!user) return <Redirect to="/" />;

    return <Component { ...props } />
};

interface AuthenticatedProps {
    component: React.FC;
}
export default Authenticated;
