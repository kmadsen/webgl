
import React from 'react';
import './App.css';
import Triangle from './basic/triangle.component';
import Rectangle from './basic/rectangle.component';
import Model from './basic/model.component';

function App() {
  return (
    <div className="App">
      <Model />
      <Rectangle />
      <Triangle />
    </div>
  );
}

export default App;
