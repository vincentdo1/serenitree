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
        const response = await axios.get('http://localhost:3000/api/plant/oawc80umu1bp73anu8780njk');
        console.log('API Response:', response.data[0]); // Assuming the response is an array and you're interested in the first item
        const data = response.data[0]; // Adjust according to actual response structure

        setStage(data.stage);
        setExp(data.exp);
        setUserId(data.userId);
        await updateExp(data.userId, parseInt(data.exp, 10) + 50);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchData();
  }, []);

  const updateExp = async (userId, newExp) => {
    try {
      let treeType = 'Seedling'
      if (newExp > 200) {
        treeType = 'Sapling'
      } else if (newExp > 250) {
        treeType = 'Mid'
      } else if (newExp > 250) {
        treeType = 'Mature'
      } else if (newExp > 300) {
        treeType = 'Old'
      }
      const response = await axios.put('http://localhost:3000/api/plant/oawc80umu1bp73anu8780njk', {
        exp: newExp,
        stage: treeType,
      });
      setStage(treeType)
      console.log('Update Response:', response.data);
      // Optionally, update the local state if needed
      setExp(newExp);
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

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
    <div className="flex flex-col justify-center items-center min-h-screen backgroundImageStyle">
      <div className="flex flex-col justify-center items-center min-h-screen">
        {/* Displaying Stage and Exp */}
        <div className="text-center mb-4">
        <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'MedievalSharp, cursive' }}>Stage: {stage}</p>
        <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'MedievalSharp, cursive' }}>Exp: {exp}</p>
        </div>
        {/* Wrap Image in a div and apply the animation class */}
        <div className="breathing-animation">
          <Image src={getImageForStage(stage)} alt="Tree" layout="fixed" width={200} height={200} />
        </div>
      </div>
    </div>
  );
}