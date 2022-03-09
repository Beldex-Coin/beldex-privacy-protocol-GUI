import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from '@mui/material';
import Main from "../Main";
import * as actionTypes from '../../common/actionTypes';

class Layout extends Component {
  // dispatch({type: actionTypes.RESET_STORE});
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
    return (
      <Container maxWidth="false" disableGutters className='rootContainer'>
        <Main {...this.props} />
        {/* {this.props.isLoading &&
          <div style={{ background: '#9e9e9e80', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 100 }}>
            <Spinner style={{ position: 'absolute', top: '50%', left: '50%' }} animation="grow" />
          </div>
        } */}
      </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  isLoading: state.loadingReducer.loading
})
export default connect(mapStateToProps)(Layout);
