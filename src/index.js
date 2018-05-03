import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scene from './components/Scene';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Scene />, document.getElementById('root'));
registerServiceWorker();
