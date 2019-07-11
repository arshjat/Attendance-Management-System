import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";

ReactDOM.render(
  <BrowserRouter>
  
  {/* BrowserRouter : A <Router> that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL. */}
    
    <Switch>
      {/* 
          If switch is not used, and path  '/admin' is found, then both the admin and auth routes are rendered by default.
          If switch is used only the route that matches the path is rendered and the other one is not rendered.
       */}
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      
      {/* Renders the admin part of the project */}
      {/* 
            '...' refers to spread syntax of javascript 
            it opens an iterable to be used further
            for eg :
                    var l = ["a","b","c"]
                    var p = ["d",...l,"e"]  
                    p is equivalent to ["d","a","b","c","e"]
      */}
      
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      {/* Renders the auth part of the project */}
      
      <Redirect from="/" to="/auth/login" />
      {/* Whenever a person goes to '/' endpoint, he is rendered to /admin/index */}
    
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
