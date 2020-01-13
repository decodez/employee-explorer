import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import Explorer from './Views/Explorer';
import EmployeeOverview from './Views/EmployeeOverview';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Explorer} />
        <Route path="/overview/:employeeName" component={EmployeeOverview} />
      </div>
    </Router>
  )
ReactDOM.render(routing, document.getElementById('root'))