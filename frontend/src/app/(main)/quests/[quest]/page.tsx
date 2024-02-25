"use client"
import { cache } from 'react'
import { notFound } from 'next/navigation'

import { Container } from '@/components/Container'
import { FormattedDate } from '@/components/FormattedDate'
import { getAllReflections } from '@/lib/reflections'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'


export default function DisplayReflections(id) {
  console.log(id)
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    async function fetchReflections() {
      try {
        const response = await axios.get(`http://localhost:3000/api/reflection/${id.params.quest}`); // Assuming this endpoint returns an array of quests
        console.log('API Response:', response.data);
        setReflections(response.data); // Ensure this is an array of quests
      } catch (error) {
        console.error('API Error:', error);
      }
    }

    fetchReflections();
  }, []);

  return (
    <div className="pt-4 pb-1 px-0 mx-auto max-w-screen-xl text-center lg:py-16">
      <p className="my-2 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        Explore your past reflections here...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reflections.map((reflection) => (
          <Link key={reflection.id} className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900" href={'/'}>
            {reflection.message}
          </Link>
        ))}
      </div>    
    </div>
  ); 
}



// const getReflections = cache(async (id) => {
//   console.log('getReflections: id:', id)
//   let reflections = await getAllReflections(id)
//   if (!reflections) {
//     notFound()
//   }
//   return reflections
// })

// export default async function Reflection({
//   params: { quest_id },
// }: {
//   params: { quest_id }
// }) {
//   console.log('reflections: quest_id:', quest_id);
//   let reflection = await getReflections(quest_id)
//   let date = new Date(reflection.message)

//   return (
//     <article className="py-16 lg:py-36">
//       <Container>
//         <header className="flex flex-col">
//           <div className="flex items-center gap-6">
            
//             <div className="flex flex-col">
//               <h1 className="mt-2 text-4xl font-bold text-slate-900">
//                 {reflection.message}
//               </h1>
//               <FormattedDate
//                 date={date}
//                 className="order-first font-mono text-sm leading-7 text-slate-500"
//               />
//             </div>
//           </div>
//           <p className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
//             {reflection.message}
//           </p>
//         </header>
//         <hr className="my-12 border-gray-200" />
//         <div
//           className="prose prose-slate mt-14 [&>h2:nth-of-type(3n)]:before:bg-violet-200 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-cyan-200 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5"
//           dangerouslySetInnerHTML={{ __html: reflection.message }}
//         />
//       </Container>
//     </article>
//   )
// }
