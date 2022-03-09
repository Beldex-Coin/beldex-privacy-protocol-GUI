import React from 'react';
import { useNavigate } from "react-router-dom";
import {  Button } from '@mui/material';
import NotFound from '../../static/404.png'
import './PageNotFound.scss';

const PageNotFound = () => {
  let navigate = useNavigate();
  return (
    <div className="errorContainer">
      <div className="my404">
        <img alt="" src={NotFound} className='errorBanner'></img>
      </div>
      <div className="content404">
        <h2> 404 </h2>
        <p className='error404'>Page Not Found</p>
        <p className='errorContent'>The page you are looking for might have been temporarily moved, permanently removed or is currently unavailable. </p>
        <div className='goToHomeContainer'>
          <Button onClick={() => navigate('/')}  variant="contained"className='submitButton' aria-label="Go To Homepage">
            GO TO HOMEPAGE
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound;