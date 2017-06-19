import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import Home from './page/Home'
import ExerciseForm from './page/admin/ExerciseForm'
import SignIn from './page/user/SignIn'
import SignUp from './page/user/SignUp'
import Header from './component/nav/Header'
import ExerciseList from './page/ExerciseList'
import Exercise from './page/Exercise'
import Page404 from './page/Page404'
import Overlay from './component/modal/Overlay'

export default (props) =>
  <Router history={{}}>
    <div className="app">
      <div className="container">
        <Header/>
        <div>
          <Switch>
            <Route path="/" exact component={Home}/>
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
