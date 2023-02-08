import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { CookiesProvider } from "react-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

ReactDOM.render(
   <React.StrictMode>
      <CookiesProvider>
        <App />
      </CookiesProvider>
   </React.StrictMode>,
   document.getElementById('root')
 );

