import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Navigation, Footer } from './nav'
import {
  About,
  Home,
  JoinUs,
  Page404,
  Workarounds,
  Search,
  RegisterPage,
  LoginPage,
  ForgottenPasswordPage,
  UserProfilePage,
} from './pages'
import { ExercisePage } from '../exercise/pages/ExercisePage'
import { useUser } from '../user/providers/UserProvider'

export const PublicApp = React.memo(function PublicAppBase() {
  const { loggedIn } = useUser()

  return (
    <Switch>
      <Route path="/login" exact component={LoginPage} />
      <Route path="/register" exact component={RegisterPage} />
      <Route path="/forgotten-password" exact component={ForgottenPasswordPage} />
      <Route exact path="/exercise/:id" component={ExercisePage} />
      <Route
        component={() => (
          <div className="container page-container">
            <Navigation />
            <main className="main-content">
              <Switch>
                <Route path="/" exact component={Home} />
                {loggedIn && <Route path="/profile" component={UserProfilePage} />}
                {/*<Route path="/subject/:subject/:topic" component={ExercisesByTopic} />*/}
                {/*<Route path="/grade/:grade" component={ExercisesByGrade} />*/}
                <Route path="/search" component={Search} />
                <Route path="/about" component={About} />
                <Route path="/joinus" component={JoinUs} />
                <Route path="/support" component={Workarounds} />
                <Route component={Page404} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      />
    </Switch>
  )
})
