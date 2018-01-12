import React from 'react'
import { connect } from 'react-redux'

import { Route, Router, Switch } from 'react-router-dom'
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
import { AdminUtils } from 'admin/page/AdminUtils'

const mapStateToProps = state => ({
  session: state.app.session
})

export default connect(mapStateToProps)(function(props) {
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
                <Route path="/" exact component={Home} />
                <Route path="/user" exact component={UserList} />
                <Route path="/classification" exact component={ClassificationList} />
                <Route path="/exercise" exact component={ExerciseList} />
                <Route path="/exercise/add/:clone" component={ExerciseForm} />
                <Route path="/exercise/add/" component={ExerciseForm} />
                <Route path="/exercise/edit/:key" component={ExerciseForm} />
                <Route path="/feedback" component={FeedbackList} />
                <Route path="/utilities" component={AdminUtils} />
                <Route path="/about" component={About} />
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
