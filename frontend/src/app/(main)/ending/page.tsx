"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function DisplayEnding(id) {
  const [quests, setQuests] = useState(null);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const response = await axios.get(`http://localhost:3000/api/quest/oawc80umu1bp73anu8780njk`);
        console.log('API Response:', response.data);
        setQuests(response.data); // Ensure this is an array of quests

        // Find the quest with the same id.params.quest value
        console.log(id.params.quest)
        const questWithId = quests.find(quest => quest.id === id.params.quest);
        console.log('Quest with id.params.quest:', questWithId);

        // Now, you have the quest with the specified id.params.quest value
      } catch (error) {
        console.error('API Error:', error);
      }
    }

    fetchQuests();
  }, [id.params.quest, quests]);

  const [latestReflection, setLatestReflection] = useState(null);
  
  useEffect(() => {
    async function fetchReflections() {
      try {
        const response = await axios.get(`http://localhost:3000/api/reflection/${id.params.quest}`);
        console.log('API Response:', response.data);

        // Sort reflections based on dates in descending order
        const sortedReflections = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Set the latest reflection
        setLatestReflection(sortedReflections[0]);

      } catch (error) {
        console.error('API Error:', error);
      }
    }

    fetchReflections();
  }, [id.params.quest]);


  const calculateDaysDifference = (date) => {
    const currentDate = new Date();
    const reflectionDate = new Date(date);
    const differenceInDays = Math.floor((reflectionDate - currentDate) / (1000 * 60 * 60 * 24));
    return differenceInDays;
  };

  const displayMessage = () => {
    if (!latestReflection) {
      return null; // Handle case where reflections haven't loaded yet
    }

    const reflectionDate = new Date(quest.endDate); // Use endDate from the quest
    const currentDate = new Date();

    if (reflectionDate > currentDate) {
      // If reflection date is in the future
      return <p>Congratulations! You have completed this reflection.</p>;
    } else {
      // Calculate difference in days
      const differenceInDays = calculateDaysDifference(quest.endDate);

      // Display encouraging message based on days or weeks
      const message = differenceInDays <= 7
        ? `Keep going! You're doing great!`
        : `Keep going! You're making progress. Reflect again soon!`;

      return <p>{message}</p>;
    }
  };

  return (
    <div>
      {displayMessage()}
    </div>
  );
}




// export default function displayEnding(id) {
//   const [quests, setQuests] = useState([]);

//   useEffect(() => {
//     async function fetchQuests() {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/reflection/${id.params.quest}`); // Assuming this endpoint returns an array of quests
//         console.log('API Response:', response.data);
//         setQuests(response.data); // Ensure this is an array of quests
//       } catch (error) {
//         console.error('API Error:', error);
//       }
//     }

//     fetchQuests();
//   }, []);

//   return (
//     <div className="pt-4 pb-1 px-0 mx-auto max-w-screen-xl text-center lg:py-16">
//       <p className="my-2 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
//         Choose a quest to reflect on...
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {quests.map((quest) => (
//           <Link key={quest.id} className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900" href={`/reflection_quest/${quest.id}`}>
//             {quest.name}
//           </Link>
//         ))}
//       </div>    
//     </div>
//   ); 
// }
