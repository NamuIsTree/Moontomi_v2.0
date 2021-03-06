import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './App';
import Home from './containers/Home';
import RegularEval from './containers/RegularEval';
import Upload from './containers/Upload';
import Lookup from './containers/Lookup';
import ReviewTab from './containers/ReviewTab';

import './index.css';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="evaluate/:id" component={RegularEval}/>
            <Route path="review" component={ReviewTab}/>
            <Route path="review/:id" component={ReviewTab}/>
            <Route path="lookup" component={Lookup}/>
            <Route path="upload" component={Upload}/>
        </Route>
    </Router>,
    document.getElementById('root')
);