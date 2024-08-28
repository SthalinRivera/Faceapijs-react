import React from 'react'
import { FaceLandmark } from "../../components/FaceLandmark";
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
export const FaceMarkDetection = () => {
    return (
        <div>

            <Navbar></Navbar>
            <FaceLandmark></FaceLandmark>
            <Footer></Footer>
        </div>
    )
}


