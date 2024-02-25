"use client"
import React, { useState } from 'react';
import { useEffect } from 'react'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import Link from 'next/link'
import { Container } from '@/components/Container'


// const getReflection = cache(async (id: string) => {
//   return id
// })


export default function PostReflectionBox(id) {
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit action

    try {
      // Perform the POST request on submit
      const response = await axios.post('http://localhost:3000/api/reflection', {
        questId: id.params.reflection, // Assuming 'id' is the reflection ID you want to send
        message: description,
      });
      console.log(response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
    <p className="my-2 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        What did you do towards your quest today?
      </p>
      <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
        <label htmlFor="comment" className="sr-only">Your reflection</label>
        <textarea
          id="comment"
          rows="4"
          className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Write a comment..."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
        <Link href='../../tree'> 
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          Submit
        </button>
        </Link>
      </div>
    </div>
  </form>
);

}