import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import * as racer from 'racer';

console.log(racer)

ReactDOM.hydrate(
  <App model={new Model(window.pageData)} />,
  document.getElementById('root')
);
