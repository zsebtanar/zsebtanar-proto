import * as React from 'react'
import { connect } from 'react-redux'
import { History } from 'history'

import { Route, Router, Switch } from 'react-router-dom'
import { Loading } from 'client-common/component/general/Loading'

import { Header } from './nav/Header'
import { SideNav } from './nav/SideNav'
import { Home } from './page/Home'
import { ExerciseList } from './page/ExerciseList'
import { ExerciseForm } from './page/excersice-edit/ExerciseForm'
import { Page404 } from 'client-common/page/Page404'
import { Overlay } from 'client-common/component/modal/Overlay'
import { UserList } from './page/user/UserList'
import { ClassificationList } from './page/classification/ClassificationList'
import { FeedbackList } from './page/FeedbackList'
import { About } from 'client-common/page/About'
import { Join } from 'client-common/page/Join'
import { Footer } from './nav/Footer'
import { AdminUtils } from './page/AdminUtils'
import { ExercisePreview } from './page/ExercisePreview'
import { isAdmin } from '../client-common/services/user'

interface RoutesProps {
  history: History
}
interface RoutesStateProps {
  session: state.Session
}

const mapStateToProps = (state: state.Root) => ({
  session: state.app.session
})

export const Routes = connect<RoutesStateProps, {}, RoutesProps>(mapStateToProps)(RoutesComponent)

function RoutesComponent(props: RoutesStateProps & RoutesProps) {
  return (
    <div className="app">
      <RouteContent {...props} />
      <Overlay />
    </div>
  )
}

function RouteContent(props: RoutesStateProps & RoutesProps) {
  if (props.session.waitingForUser) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  if (props.session.signedIn && isAdmin(props.session.token)) {
    return (
      <Router history={props.history}>
        <AdminRoutes />
      </Router>
    )
  }

  props.history.push('/')
  return <Home/>
}

function AdminRoutes() {
  return (
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
          <Route path="/exercise/view/:key" component={ExercisePreview} />
          <Route path="/feedback" component={FeedbackList} />
          <Route path="/utilities" component={AdminUtils} />
          <Route path="/about" component={About} />
          <Route path="/join" component={Join} />
          <Route component={Page404} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}
