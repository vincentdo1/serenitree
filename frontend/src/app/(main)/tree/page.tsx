"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import images for each stage
import seedlingImage from '../../../images/tree1.png'; // Adjust the path as needed
import saplingImage from '../../../images/tree2.png'; // Adjust the path as needed
import midImage from '../../../images/tree3.png'; // Adjust the path as needed
import matureImage from '../../../images/tree4.png'; // Adjust the path as needed
import oldImage from '../../../images/tree5.png'; // Adjust the path as needed


export default function Home() {
  const [stage, setStage] = useState('');
  const [exp, setExp] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/plant/1');
        console.log('API Response:', response.data[0]); // Assuming the response is an array and you're interested in the first item
        const data = response.data[0]; // Adjust according to actual response structure

        setStage(data.stage);
        setExp(data.exp);
        setUserId(data.userId);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchData();
  }, []);

  // Function to determine which tree image to display
  const getImageForStage = (stage) => {
    switch(stage) {
      case 'Seedling':
        return seedlingImage;
      case 'Sapling':
        return saplingImage;
      case 'Mid':
        return midImage;
      case 'Mature':
        return matureImage;
      case 'Old':
        return oldImage;
      default:
        return seedlingImage; // Default image if stage is unknown
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Displaying Stage and Exp */}
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">Stage: {stage}</p>
        <p className="text-lg font-semibold">Exp: {exp}</p>
      </div>
      {/* Wrap Image in a div and apply the animation class */}
      <div className="breathing-animation">
        <Image src={getImageForStage(stage)} alt="Tree" layout="fixed" />
        </div>
    </div>
  );
}
