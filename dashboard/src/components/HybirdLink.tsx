import { Link, LinkProps } from "react-router-dom";

const HybirdLink: React.FC<HybirdLinkProps> = ({ to, children, ...props }) => {
    return to.startsWith("http")
        ? <a target="_blank" href={ to } { ...props }>{ children }</a>
        : <Link to={ to } { ...props }>{ children }</Link>
};

interface HybirdLinkProps extends LinkProps {
    to: string;
}

export default HybirdLink;