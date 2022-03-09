import * as actionTypes from "../common/actionTypes";
import store from '../store';

const loading = (showLoading) => {
  return async (dispatch) => dispatch({
    type: actionTypes.SHOWLOADING,
    payload: showLoading
  });
};

class Interceptors {

  responseFailureHandler = (error, handleForbiddenError) => {
    store.dispatch(loading(false));
    if (error) {
      const handlingErr = error;
      switch (true) {
        case (error.response && error.response.status === 401):
          // Router.push('/login')
          break;
        case (error.message && error.message.indexOf('timeout') >= 0 && handleForbiddenError):
        case (error.response && error.response.status === 403 && handleForbiddenError):
          if (error.message.indexOf('timeout') >= 0) {
            handlingErr.response = { status: 408 };
          }
          handleForbiddenError(handlingErr);
          break;
        default:
          return error.response;
      }
    }
    return false;
  };

  addResponseInterceptors = (axiosInstance, handleForbiddenError = null) => {
    if (
      axiosInstance
      && axiosInstance.interceptors
      && axiosInstance.interceptors.response
      && typeof axiosInstance.interceptors.response.use === 'function'
    ) {
      axiosInstance.interceptors.response.use(
        response => {
          store.dispatch(loading(false));
          return response;
        },
        error => this.responseFailureHandler(error, handleForbiddenError)
      );
    }
  }

  addRequestInterceptors = (axiosInstance, apiHeader, urlSuffix) => {
    if (
      axiosInstance
      && axiosInstance.interceptors
      && axiosInstance.interceptors.request
      && typeof axiosInstance.interceptors.request.use === 'function'
    ) {
      axiosInstance.interceptors.request.use((config) => {
        const newConfig = config;
        store.dispatch(loading(true));
        return newConfig;
      });
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loading: () => dispatch(loading())
  };
};
export default Interceptors;
// export default connect({}, mapDispatchToProps)(Interceptors);

/** 
 * import the Interceptors
 * in clients.jsx before exporting that file,
 * add const interceptors = new Interceptors();
 * then:===> interceptors.addResponseInterceptors(tradeMarketListClients)
 * interceptors.addResponseInterceptors(getCurrencyPriceClients)
 * ....like these we need to add all the clients for 401.
 * */
