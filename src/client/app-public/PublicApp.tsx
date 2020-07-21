import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { ExercisePage } from '../exercise/pages/ExercisePage'
import { useUser } from '../user/providers/UserProvider'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ForgottenPasswordPage } from './pages/auth/ForgottenPasswordPage'
import { Home } from './pages/Home'
import { UserProfilePage } from './pages/UserProfilePage'
import { Search } from './pages/Search'
import { About } from './pages/About'
import { JoinUs } from './pages/JoinUs'
import { Workarounds } from './pages/Workarounds'
import { Page404 } from './pages/Page404'
import { Footer } from './nav/Footer'
import { Navigation } from './nav/Navigation'
import { ListPage } from './pages/ListPage'

export function PublicApp(): JSX.Element {
  console.log('public app')
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
                <Route path="/profile" component={UserProfilePage} />
                <Route path="/list" component={ListPage} />
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
}
