
import React from 'react';
import './App.css';
import Triangle from './basic/triangle.component';
import Rectangle from './basic/rectangle.component';
import Model from './basic/model.component';
import AnimateComponent from './basic/animate.component';

function App() {
  return (
    <div className="App">
      <AnimateComponent />
      <Model />
      <Rectangle />
      <Triangle />
    </div>
  );
}

export default App;
