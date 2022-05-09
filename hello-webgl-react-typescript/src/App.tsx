
import React from 'react';
import './App.css';

import TextureComponent from './basic/texture.component';
import CubeComponent from './basic/cube.component';
import AnimateComponent from './basic/animate.component';
import Model from './basic/model.component';
import Rectangle from './basic/rectangle.component';
import Triangle from './basic/triangle.component';
import FilePickerComponent from './filepicker/filepicker.component';
import AudioComponent from './audio/audio.component';

function App() {
  return (
    <div className="App">
      <AudioComponent />
      <FilePickerComponent />
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
