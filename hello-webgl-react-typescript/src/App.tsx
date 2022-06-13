
import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom"
import './App.css';

import TextureComponent from './basic/texture.component';
import CubeComponent from './basic/cube.component';
import AnimateComponent from './basic/animate.component';
import Model from './basic/model.component';
import Rectangle from './basic/rectangle.component';
import Triangle from './basic/triangle.component';
import FilePickerComponent from './filepicker/filepicker.component';
import AudioComponent from './audio/audio.component';
import Header from './components/header/header';

function App() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <Routes>
        <Route path="/">
          Home
        </Route>
        <Route path="/basic" element={<Basic />}/>
        <Route path="/about">
          Nothing here
        </Route>
      </Routes>
    </div>
  );
}

function Basic() {
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
  )
}

export default App;
