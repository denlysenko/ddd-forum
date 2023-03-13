import React from 'react';
import Helmet from 'react-helmet';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withUsersService from '../../modules/users/hocs/withUsersService';
import './Layout.scss';

class Layout extends React.Component<{
  children: JSX.Element | JSX.Element[];
}> {
  render() {
    return (
      <div className="app-layout">
        <div className="app-layout-inner">
          {
            <Helmet>
              <title>{'siteMetaData.title'}</title>
              {/* TODO: The rest */}
              <link
                href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,400i,500,700,700i&display=swap"
                rel="stylesheet"
              ></link>
              <link
                rel="stylesheet"
                href="//cdn.quilljs.com/1.2.6/quill.snow.css"
              ></link>
            </Helmet>
          }
          <ToastContainer />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withUsersService(Layout);
