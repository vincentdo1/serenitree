"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function DisplayQuests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const response = await axios.get('http://localhost:3000/api/quest/1'); // Assuming this endpoint returns an array of quests
        console.log('API Response:', response.data);
        setQuests(response.data); // Ensure this is an array of quests
      } catch (error) {
        console.error('API Error:', error);
      }
    }

    fetchQuests();
  }, []);

  return (
    <div className="pt-4 pb-1 px-0 mx-auto max-w-screen-xl text-center lg:py-16">
      <p className="my-2 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        Choose a quest to reflect on...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((quest) => (
          <Link key={quest.id} className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900" href={`/reflection_quest/${quest.id}`}>
            {quest.name}
          </Link>
        ))}
      </div>    
    </div>
  ); 
}
