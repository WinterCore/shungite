import { BrowserRouter, Switch, Route } from "react-router-dom";

import Index from "./routes/Index";
import Emotes from "./routes/Emotes";
import Emote from "./routes/Emote";
import ConfirmTwitchLogin from "./routes/ConfirmTwitchLogin";

import Header from "./components/Header";

import { UserProvider } from "./contexts/user";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Header />
                <section>
                    <Switch>
                        <Route exact path="/" component={ Index } />
                        <Route exact path="/emotes" component={ Emotes } />
                        <Route exact path="/emotes/:id" component={ Emote } />
                        <Route exact path="/confirm-twitch-login" component={ ConfirmTwitchLogin } />
                    </Switch>
                </section>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
