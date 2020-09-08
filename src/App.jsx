import React, { PureComponent } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect } from 'react-router'
import {
  majorScale,
  Pane,
  Spinner,
  Heading,
  toaster,
  Code,
  Pre,
  Text,
  Link,
  Button,
  defaultTheme,
  ThemeProvider,
} from 'evergreen-ui'
import { connect } from 'react-redux'

import Navbar from './components/Navbar'
import Index from 'pages/Index'
import Domains from 'pages/Domains'
import Login from 'pages/Login'
import Signup from 'pages/Signup'

import AccountIndex from 'pages/account/Index'

import AdminIndex from 'pages/admin/Index'

import styles from './styles/container.scss'
import { Helmet } from 'react-helmet'

const mapRouteStateToProps = (state) => ({
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
})

const NewRoute = connect(mapRouteStateToProps)(
  ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} {...rest} />
      }}
    />
  )
)
const LoggedInRoute = connect(mapRouteStateToProps)(
  ({ component: Component, profile, loggedIn, ...rest }) => {
    if (!loggedIn) {
      return (
        <Route
          {...rest}
          render={(props) => {
            //toastr.error('Error', 'Please login before accessing this page.')
            toaster.danger('Not logged in', {
              description: 'Please login before accessing this page.',
            })
            return <Redirect to="/" />
          }}
        />
      )
    }
    return (
      <Route
        {...rest}
        render={(props) => {
          return (
            <Component
              {...props}
              profile={profile}
              loggedIn={loggedIn}
              {...rest}
            />
          )
        }}
      />
    )
  }
)
const AdminRoute = connect(mapRouteStateToProps)(
  ({ component: Component, profile, loggedIn, ...rest }) => {
    if (!loggedIn) {
      return (
        <Route
          {...rest}
          render={(props) => {
            toaster.danger('Not logged in', {
              description: 'Please login before accessing this page.',
            })
            return <Redirect to="/" />
          }}
        />
      )
    }
    if (!profile.admin) {
      return (
        <Route
          {...rest}
          render={(props) => {
            toaster.danger('Not an admin', {
              description: 'You do not have permission to access this page',
            })
            return <Redirect to="/" />
          }}
        />
      )
    }
    return (
      <Route
        {...rest}
        render={(props) => {
          return (
            <Component
              {...props}
              profile={profile}
              loggedIn={loggedIn}
              {...rest}
            />
          )
        }}
      />
    )
  }
)

const mapStateToProps = (state) => ({
  profile: state.root.profile,
  loggedIn: state.root.loggedIn,
  realUser: state.root.realUser,
})

const theme = {
  ...defaultTheme,
}
theme.typography.fontFamilies.display =
  'Inter,' + theme.typography.fontFamilies.display
theme.typography.fontFamilies.ui = 'Inter,' + theme.typography.fontFamilies.ui
class App extends PureComponent {
  state = {
    hasError: false,
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo)
  }
  render() {
    const { loggedIn, realUser } = this.props
    if (this.state.hasError) {
      return (
        <ThemeProvider value={theme}>
          <ConnectedRouter history={this.props.history}>
            <Navbar />
            <Pane
              marginLeft={majorScale(10)}
              marginRight={majorScale(10)}
              marginTop={majorScale(2)}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={'100%'}
            >
              <Heading size={800} marginBottom={majorScale(1)}>
                Error while loading page
              </Heading>
              <Text>
                Please send the following data to a developer so we can fix the
                problem smoothly.
              </Text>
              <Button
                intent="primary"
                is="a"
                href="/"
                marginBottom={majorScale(1)}
              >
                Go home
              </Button>
              <Code width={'100%'}>
                <Pre fontFamily="mono">
                  {this.state.error.stack
                    ? this.state.error.stack
                    : this.state.error.toString()}
                </Pre>
              </Code>
            </Pane>
          </ConnectedRouter>
        </ThemeProvider>
      )
    }
    if (loggedIn && !realUser) {
      return (
        <ThemeProvider value={theme}>
          <ConnectedRouter history={this.props.history}>
            <Navbar />
            <Pane
              marginLeft={majorScale(10)}
              marginRight={majorScale(10)}
              marginTop={majorScale(2)}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={'100%'}
            >
              <Spinner size={56} />
              <Heading size={100}>Loading</Heading>
            </Pane>
          </ConnectedRouter>
        </ThemeProvider>
      )
    }
    return (
      <ThemeProvider value={theme}>
        <ConnectedRouter
          history={this.props.history}
          /*className={classNames(styles.root)}*/
        >
          <Helmet>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          <Navbar />
          <Pane marginTop={majorScale(2)} className={styles.container}>
            <Switch>
              <Route exact path="/" component={Index} />
              <Route exact path="/domains" component={Domains} />

              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />

              <LoggedInRoute path="/account" component={AccountIndex} />

              <AdminRoute path="/admin" component={AdminIndex} />
            </Switch>
          </Pane>
        </ConnectedRouter>
      </ThemeProvider>
    )
  }
}
export default connect(mapStateToProps)(App)
