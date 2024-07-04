import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { add_request_details } from './Redux/actions/RequestDetailsActions';
import NetworkMonitor from './components/NetworkMonitor/NetworkMonitor';

const App = () => {
  const dispatch = useDispatch();

  const handleTestApi = async (url) => {
    try {
      const start = performance.now();
      const response = await fetch(url);
      const duration = performance.now() - start;
      const contentType = response.headers.get('content-type');
      const size = response.headers.get('content-length') || (await response.clone().text()).length;

      const requestDetails = {
        name: url,
        method: 'GET',
        status: response.status,
        size: parseInt(size),
        duration: duration,
        responseText: await response.clone().text(),
        type: contentType || 'unknown',
      };
      dispatch(add_request_details(requestDetails));
    } catch (error) {
      const duration = performance.now() - start;
      const requestDetails = {
        name: url,
        method: 'GET',
        status: error.response ? error.response.status : 'Network Error',
        size: 0,
        duration: duration,
        responseText: error.message,
        type: 'fetch',
      };
      dispatch(add_request_details(requestDetails));
    }
  };

  return (
    <div className="App">
      <NetworkMonitor onTestApi={handleTestApi} />
    </div>
  );
};

export default App;
