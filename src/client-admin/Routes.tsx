import { Loading } from 'client-common/component/general/Loading'
import { Overlay } from 'client-common/component/modal/Overlay'
import { About } from 'client-common/page/About'
import { JoinUs } from 'client-common/page/JoinUs'
import { Page404 } from 'client-common/page/Page404'
import { History } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'

import { Route, Router, Switch } from 'react-router-dom'
import { AppNotifications } from '../client-common/component/general/AppNotifications'
import { isAdmin } from '../client-common/services/user'
import { Footer } from './nav/Footer'

import { Header } from './nav/Header'
import { SideNav } from './nav/SideNav'
import { AdminUtils } from './page/AdminUtils'
import { ClassificationList } from './page/classification/ClassificationList'
import { ExerciseListForm } from './page/excerciseList/form/ExerciseListForm'
import { ExerciseListsGrid } from './page/excerciseList/grid/ExerciseListsGrid'
import { ExerciseForm } from './page/exerciseEdit/ExerciseForm'
import { ExercisePreview } from './page/ExercisePreview'
import { Exercises } from './page/Exercises'
import { FeedbackList } from './page/FeedbackList'
import { Home } from './page/Home'
import { UserList } from './page/user/UserList'

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

  return <Home />
}

function AdminRoutes() {
  return (
    <div>
      <div className="container">
        <Header />
        <SideNav />
        <div className="content">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/user" exact component={UserList} />
            <Route path="/classification" exact component={ClassificationList} />
            <Route path="/exercise" exact component={Exercises} />
            <Route path="/exercise/add/:clone" component={ExerciseForm} />
            <Route path="/exercise/add/" component={ExerciseForm} />
            <Route path="/exercise/edit/:key" component={ExerciseForm} />
            <Route path="/exercise/view/:key" component={ExercisePreview} />
            <Route path="/exercise-list" exact component={ExerciseListsGrid} />
            <Route path="/exercise-list/add" component={ExerciseListForm} />
            <Route path="/exercise-list/edit/:key" component={ExerciseListForm} />
            <Route path="/feedback" component={FeedbackList} />
            <Route path="/utilities" component={AdminUtils} />
            <Route path="/about" component={About} />
            <Route path="/joinus" component={JoinUs} />
            <Route component={Page404} />
          </Switch>
        </div>
        <Footer />
      </div>
      <AppNotifications />
    </div>
  )
}
