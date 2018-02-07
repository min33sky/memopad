import React from 'react';
import ReactDOM from 'react-dom';
// Container
import { App, Home, Login, Register, Error404 } from './containers';
// Router
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

import registerServiceWorker from './registerServiceWorker';

// store 생성
const store = createStore(reducers, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) );

const Root = () => (
    <Provider store={store}>
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
    </Provider>
);

ReactDOM.render(
    <Root />,
    document.getElementById('root'));
registerServiceWorker();
