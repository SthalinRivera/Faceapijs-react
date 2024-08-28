import React from 'react'
import { FaceRecognition } from "../../components/FaceRecognition";
import { Footer } from "../../components/Footer";
import { Navbar } from '../../components/Navbar';
export const Home = () => {
    return (
        <div>
            <Navbar></Navbar>
            <FaceRecognition></FaceRecognition>
            <Footer></Footer>
        </div>
    )
}


