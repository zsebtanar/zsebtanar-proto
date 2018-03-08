import React from 'react'
import { connect } from 'react-redux'

import {
  Route,
  Router,
  Switch,
  Redirect
} from 'react-router-dom'
import Loading from 'shared/component/general/Loading'
import Header from './nav/Header'
import SideNav from './nav/SideNav'
import Home from './page/Home'
import ExerciseList from './page/ExerciseList'
import ExerciseForm from './page/excersice-edit/ExerciseForm'
import Page404 from 'shared/page/Page404'
import Overlay from 'shared/component/modal/Overlay'
import UserList from './page/user/UserList'
import ClassificationList from './page/classification/ClassificationList'
import FeedbackList from 'admin/page/FeedbackList'
import About from 'shared/page/About'
import Footer from 'admin/nav/Footer'
import { isAdmin } from 'shared/services/user'
import { AdminUtils } from 'admin/page/AdminUtils'

import { ExercisePreview } from 'admin/page/ExercisePreview'

const mapStateToProps = state => ({
  session: state.app.session
})

const AuthRoutes = connect(mapStateToProps)(function (props) {
  return (
    <Router history={props.history}>
      <div className="app">
        {props.session.waitingForUser ? (
          <div>
            <Loading />
          </div>
        ) : (
            <div className="container">
              <Header />
              <SideNav />
              <div className="content">
                <Switch>
                  <PrivateRoute session={props.session} path="/" exact component={Home} />
                  <PrivateRoute session={props.session} path="/user" exact component={UserList} />
                  <PrivateRoute session={props.session} path="/classification" exact component={ClassificationList} />
                  <PrivateRoute session={props.session} path="/exercise" exact component={ExerciseList} />
                  <PrivateRoute session={props.session} path="/exercise/add/:clone" component={ExerciseForm} />
                  <PrivateRoute session={props.session} path="/exercise/add/" component={ExerciseForm} />
                  <PrivateRoute session={props.session} path="/exercise/edit/:key" component={ExerciseForm} />
                  <PrivateRoute session={props.session} path="/exercise/view/:key" component={ExercisePreview} />
                  <PrivateRoute session={props.session} path="/feedback" component={FeedbackList} />
                  <PrivateRoute session={props.session} path="/utilities" component={AdminUtils} />
                  <Route component={Page404} />
                </Switch>
              </div>
              <Footer />
            </div>
          )}
        <Overlay />
      </div>
    </Router>
  )
})

const PrivateRoute = ({ session: Session, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (Session.signedIn && isAdmin(Session.token)) {
        return <Component {...props} />
      } else {
        window.location = '/'
      }
    }}
  />
);

export default AuthRoutes;