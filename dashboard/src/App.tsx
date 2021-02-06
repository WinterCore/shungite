import { BrowserRouter, Switch, Route } from "react-router-dom";
import classnames from "classnames";

import Index from "./routes/Index";
import Emotes from "./routes/Emotes";
import ConfirmTwitchLogin from "./routes/ConfirmTwitchLogin";

import Header from "./components/Header";

import { UserProvider } from "./contexts/user";

import us from "./util.module.css";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Header />
                <section
                    className={ classnames(us.fullpageContainer, us.flex, us.alignCenter, us.justifyCenter) }
                >
                    <Switch>
                        <Route exact path="/" component={ Index } />
                        <Route exact path="/emotes" component={ Emotes } />
                        <Route exact path="/confirm-twitch-login" component={ ConfirmTwitchLogin } />
                    </Switch>
                </section>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
