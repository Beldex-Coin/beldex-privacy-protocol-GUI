import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, CircularProgress } from '@mui/material';
import Main from "../Main";
import * as actionTypes from '../../common/actionTypes';

class Layout extends Component {
  componentDidMount() {
    // this.props.dispatch({type: actionTypes.RESET_STORE});
    window.addEventListener("beforeunload", this.onUnload)
  }
  onUnload = (e) => {
    this.props.dispatch({
      type: actionTypes.SHOWLOADING,
      payload: false
    })
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload)
  }

  render() {
    if (this.props.isLoading) {
      document.querySelector('body').classList.add('scrollHidden')
    } else {
      document.querySelector('body').classList.remove('scrollHidden')

    }
    return (
      <Fragment>
        <Container maxWidth="false" disableGutters className='rootContainer'>
          <Main {...this.props} />
        </Container>
        {this.props.isLoading &&
          <div style={{ background: '#0e0e0e7d', height: '100%', width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 100000 }}>
            <CircularProgress color="primary" sx={{ position: 'absolute', top: '50%', left: '50%' }} />
          </div>
        }
      </Fragment>
    )
  }
}


const mapStateToProps = (state) => ({
  isLoading: state.loadingReducer.loading
})
export default connect(mapStateToProps)(Layout);
