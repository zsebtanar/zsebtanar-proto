import React from 'react'
import { Switch, Route } from 'react-router'
import { Navigation, Footer } from 'client/app-admin/nav'
import { Page404, Home } from 'client/app-admin/pages'
import { AdminUtils } from 'client/app-admin/pages/AdminUtils'
import { UserList } from 'client/user/pages/UserList'
import { FeedbackGrid } from 'client/feedback/pages/FeedbackGrid'
import { useUser } from 'client/user/providers/UserProvider'
import { Loading } from 'client/generic/components'
import { WikiPageGrid } from 'client/wiki/page/WikiPageGrid'

export function AdminApp() {
  const { loading } = useUser()

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="container page-container">
      <Navigation />
      <main className="main-content">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/user" exact component={UserList} />

          {/*<Route path="/categories" exact component={MainCategoryGrid} />*/}
          {/*<Route path="/categories/:id" exact component={SubCategoryGrid} />*/}

          {/*/!* Exercises *!/*/}
          {/*<Route path="/exercise" exact component={Exercises} />*/}
          {/*<Route path="/exercise/add/:clone" component={ExerciseForm} />*/}
          {/*<Route path="/exercise/add/" component={ExerciseForm} />*/}
          {/*<Route path="/exercise/edit/:key" component={ExerciseForm} />*/}
          {/*<Route path="/exercise/view/:key" component={ExercisePreview} />*/}

          {/*/!* Exercises sheet *!/*/}
          {/*<Route path="/exercise-sheet" exact component={ExerciseSheetGrid} />*/}
          {/*<Route path="/exercise-sheet/add" component={ExerciseSheetForm} />*/}
          {/*<Route path="/exercise-sheet/edit/:key" component={ExerciseSheetForm} />*/}

          {/*/!* Wiki pages *!/*/}
          <Route path="/wiki-page" exact component={WikiPageGrid} />
          {/*<Route path="/wiki-page/add" exact component={WikiPageForm} />*/}
          {/*<Route path="/wiki-page/edit/:key" exact component={WikiPageForm} />*/}

          <Route path="/feedback" component={FeedbackGrid} />
          <Route path="/utilities" component={AdminUtils} />
          <Route component={Page404} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
