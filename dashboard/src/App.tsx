import { BrowserRouter, Switch, Route } from "react-router-dom";

import Index from "./routes/Index";
import Emotes from "./routes/Emotes";
import Emote from "./routes/Emote";
import Dashboard from "./routes/Dashboard";
import Users from "./routes/Users";
import ConfirmTwitchLogin from "./routes/ConfirmTwitchLogin";
import NotFound from "./routes/NotFound";

import Header from "./components/Header";

import { UserProvider } from "./contexts/user";

import Authenticated from "./components/Authenticated";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Header />
                <Switch>
                    <Route exact path="/" component={ Index } />
                    <Route exact path="/emotes" component={ Emotes } />
                    <Route exact path="/emotes/:id" component={ Emote } />
                    <Route exact path="/dashboard" render={ () => <Authenticated component={ Dashboard } /> } />
                    <Route exact path="/users/:username" component={ Users } />
                    <Route exact path="/confirm-twitch-login" component={ ConfirmTwitchLogin } />
                    <Route component={ NotFound } />
                </Switch>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
