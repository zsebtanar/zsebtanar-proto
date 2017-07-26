import React from 'react'

import { Route, Router, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import Header from './nav/Header'
import Home from './page/Home'
import SignIn from 'public/page/auth/SignIn'
import SignUp from 'public/page/auth/SignUp'
import ExerciseList from './page/ExerciseList'
import ExerciseForm from './page/ExerciseForm'
import Exercise from './page/Exercise'
import Page404 from 'shared/page/Page404'
import Overlay from 'shared/component/modal/Overlay'
import UserList from './page/user/UserList'
import ClassificationList from './page/classification/ClassificationList'

export const history = createHistory({
  basename: '/admin/',
  forceRefresh: false,
  getUserConfirmation: (message, callback) => callback(window.confirm(message)),
  keyLength: 6
})

export default (props) =>
  <Router history={history}>
    <div className="app">
      <div className="container">
        <Header/>
        <div className="content">
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/user" exact component={UserList}/>
            <Route path="/classification" exact component={ClassificationList}/>
            <Route path="/exercise" exact component={ExerciseList}/>
            <Route path="/exercise/add/:clone" component={ExerciseForm}/>
            <Route path="/exercise/add/" component={ExerciseForm}/>
            <Route path="/exercise/view/:key" component={Exercise}/>
            <Route path="/exercise/edit/:key" component={ExerciseForm}/>
            <Route path="/sign-up" component={SignUp}/>
            <Route path="/sign-in" component={SignIn}/>
            <Route component={Page404}/>
          </Switch>
        </div>

        <footer className="footer">
          <p>&copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}</p>
        </footer>

      </div>
      <Overlay/>
    </div>
  </Router>
