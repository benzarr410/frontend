import React, { PureComponent } from 'react'
import { Pane, Text, Button, minorScale } from 'evergreen-ui'
import { connect } from 'react-redux'
const mapStateToProps = (state) => ({
  profile: state.root.profile,
  session: state.root.session,
})
class AccountShareX extends PureComponent {
  render() {
    const { session } = this.props
    return (
      <Pane display="flex" flexDirection="column">
        <Text>ShareX config generator</Text>
        <Text>
          More domains will be added as time goes on. Check Discord for
          announcements on new domains.
        </Text>
        <Pane marginTop={minorScale(1)}>
          <Button
            appearance="primary"
            is="a"
            href={`https://api.pxl.blue/users/@me/generate_sharex_config?auth=${encodeURIComponent(
              session
            )}`}
            target="_blank"
          >
            Download Config
          </Button>
        </Pane>
      </Pane>
    )
  }
}

export default connect(mapStateToProps)(AccountShareX)