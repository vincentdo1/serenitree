"use client"
import Link from 'next/link'

import { Container } from '@/components/Container'
import { EpisodePlayButton } from '@/components/EpisodePlayButton'
import { FormattedDate } from '@/components/FormattedDate'
import { type Episode, getAllEpisodes } from '@/lib/episodes'
import { type Quest, getAllQuests } from '@/lib/quests'
import React, { useState, useEffect } from 'react';
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
        Pick a quest to see where you've come so far...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((quest) => (
          <Link key={quest.id} className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900" href={`/quests/${quest.id}`}>
            {quest.name}
          </Link>
        ))}
      </div>    
    </div>
  ); 
}

// function QuestEntry({ quest }: { quest: Quest }) {
//   let date = new Date(quest.createDate)
//   console.log("quest:", quest);

//   return (
//     <article
//       aria-labelledby={`episode-${1}-title`}
//       className="py-10 sm:py-12"
//     >
//       <Container>
//         <div className="flex flex-col items-start">
//           <h2
//             id={`episode-${1}-title`}
//             className="mt-2 text-lg font-bold text-slate-900"
//           >
//             <Link href={{
//               pathname: '/quests/${1}',
//               query: {
//                 id: '1'
//               }
//             }}>{quest.name}</Link>
//           </h2>
//           <FormattedDate
//             date={date}
//             className="order-first font-mono text-sm leading-7 text-slate-500"
//           />
//           <p className="mt-1 text-base leading-7 text-slate-700">
//             {quest.description}
//           </p>
//           <div className="mt-4 flex items-center gap-4">
//             <span
//               aria-hidden="true"
//               className="text-sm font-bold text-slate-400"
//             >
//               /
//             </span>
//             <Link
//               href={`quests/${1}`}
//               className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
//               aria-label={`Show notes for episode ${quest.name}`}
//             >
//               Show notes
//             </Link>
//           </div>
//         </div>
//       </Container>
//     </article>
//   )
// }

// export default async function Home() {
//   let quests = await getAllQuests('1')
//   // console.log(quests);

//   return (
//     <div className="pb-6 pt-6 sm:pb-4 lg:pt-12">

//       <Container>
//         {/* Profile Picture */}
//         <div className=" flex items-center gap-4">
//             <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300" src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt="" />
//             <div className="font-medium dark:text-white">
//                 <div className="font-semibold">Jese Leos</div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">155 XP</div>
//             </div>
//         </div>

//         {/* <h1 className="text-2xl font-bold leading-7 text-slate-900">
//           Quests
//         </h1> */}
//       </Container>



//       <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
//         {quests.map((quest: Quest) => (
//           <QuestEntry key={1} quest={quest} />
//         ))}
//       </div>
//     </div>
//   )
// }

// export const revalidate = 10