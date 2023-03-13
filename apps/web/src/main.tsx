import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './app/App';
import configureStore from './app/shared/infra/redux/configureStore';
import { initialReduxStartupScript } from './app/shared/infra/redux/startupScript';

const store = configureStore();

initialReduxStartupScript(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
