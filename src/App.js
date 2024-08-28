// App.js
import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { FaceMarkDetection } from "./pages/FaceMarkDetection";
const App = () => {
  return (
    <div className=' bg-gray-100 dark:bg-gray-900 p-4  h-screen w-screen'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faceMarkDetection" element={<FaceMarkDetection />} />
      </Routes>
      
    </div>
  );
};

export default App;