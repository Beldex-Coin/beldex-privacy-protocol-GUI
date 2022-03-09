import axios from 'axios';
import Interceptors from './Interceptors';

const BASE_URL = `${process.env.REACT_APP_COREAPI}/${process.env.REACT_APP_COREAPI_VERSION}`;

const clients = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
});


const interceptors = new Interceptors();
interceptors.addRequestInterceptors(clients);
interceptors.addResponseInterceptors(clients);
export default clients;