"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Container } from '@/components/Container'

export default function DisplayQuests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const response = await axios.get('http://localhost:3000/api/quest/oawc80umu1bp73anu8780njk'); // Assuming this endpoint returns an array of quests
        console.log('API Response:', response.data);
        setQuests(response.data); // Ensure this is an array of quests
      } catch (error) {
        console.error('API Error:', error);
      }
    }

    fetchQuests();
  }, []);

  return (
    <div className=" bg-white max-w-sm pb-6 pt-6 sm:pb-4 lg:pt-12">
      <Container>
        {/* Profile Picture */}
        <div className=" flex items-center gap-4">
            <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300" src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt="" />
            <div className="font-medium dark:text-white">
                <div className="font-semibold">Jese Leos</div>
                <div className="flex justify-between mb-1">
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
          <span className="text-sm font-medium text-green-700 dark:text-white">Level 5  - 125 XP</span>
            </div>
        </div>


      </Container>


      <div className="mx-5">

        <div className="p-6 my-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="text-center font-normal text-gray-500 dark:text-gray-400">Choose a quest to reflect on...</p>
        </div>

        <div className="pt-4 pb-1 px-0 mx-auto max-w-screen-xl text-center lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quests.map((quest) => (
              <Link key={quest.id} className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900" href={`/reflection_quest/${quest.id}`}>
                {quest.name}
              </Link>
            ))}
          </div>    
        </div>

      </div>
    </div>
    
  ); 
}
