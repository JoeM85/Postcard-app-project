import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
const WebFont = require('webfontloader');

WebFont.load({
  google: {
    families: ['Lobster', 'Indie Flower', 'Permanent Marker', 'Satisfy', 'Bangers', 'Tangerine'],
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
