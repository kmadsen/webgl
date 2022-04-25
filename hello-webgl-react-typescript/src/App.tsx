
import React from 'react';
import './App.css';

import TextureComponent from './basic/texture.component';
import CubeComponent from './basic/cube.component';
import AnimateComponent from './basic/animate.component';
import Model from './basic/model.component';
import Rectangle from './basic/rectangle.component';
import Triangle from './basic/triangle.component';
import MatrixMxN from './matrix/matrix';
import FilePickerComponent from './filepicker/filepicker.component';


const MatrixComponent = () => {
  const matrix = new MatrixMxN(4, 3).identity()
  matrix.log()

  return (
    <div>
      what
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <FilePickerComponent />
      <MatrixComponent />
      <TextureComponent />
      <CubeComponent />
      <AnimateComponent />
      <Model />
      <Rectangle />
      <Triangle />
    </div>
  );
}

export default App;
