import React from 'react'
import {Provider} from 'react-redux'
import configureStore from './store/store'
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'
import Home from './page/Home'
import About from './page/About'
import Topics from './page/Topics'
import AddExercise from './page/admin/AddExercise'


const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)

export default () => (
  <Provider store={store}>
    <Router history={{}}>
      <div className="container">
        <div className="header clearfix">
          <nav>
            <ul className="nav nav-pills float-right">
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" exact to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/topics">Topics</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/add-exercise">
                  <i className="fa fa-plus"/> Add exercise
                </NavLink>
              </li>
            </ul>
          </nav>
          <h3 className="text-muted logo">Zsebtanár</h3>
        </div>

        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/topics" component={Topics}/>
          <Route path="/add-exercise" component={AddExercise}/>
        </div>

        <footer className="footer">
          <p>&copy; Company 2017</p>
        </footer>

      </div>
    </Router>
  </Provider>
)