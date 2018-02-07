import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App, Home, Login, Register, Error404 } from './containers';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
    <App>
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route component={Error404} />
            </Switch>
        </Router>
    </App>
);

ReactDOM.render(
    <Root />,
    document.getElementById('root'));
registerServiceWorker();
