"use client"
import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import Link from 'next/link'
import { Container } from '@/components/Container'

export default function DisplayTextBox() {
  const [startDate, setStartDate] = useState(new Date());
  const [quest, setQuest] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/quest', {
        id: 3,
        name: quest,
        description: description,
        endDate: startDate,
        category: category,
        difficulty: difficulty,
        userId: 1
      });

      // Handle response data as needed
      console.log('API Response:', response.data);

      // Reset the form fields after successful submission
      setQuest('');
      setDescription('');
      setCategory('');
      setDifficulty('');
      setStartDate(new Date());

      // Redirect or perform any other action after successful submission
      // Example: router.push('/success');
    } catch (error) {
      // Handle error
      console.error('API Error:', error);
    }
  };

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
            <p className="font-normal text-gray-500 dark:text-gray-400">Let's journey onto a new quest together...</p>
        </div>

        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="quest" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your quest</label>
            <input
              type="text"
              id="quest"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Start a quest!"
              required
              value={quest}
              onChange={(e) => setQuest(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Description</label>
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Describe your quest"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-5">
            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select end date</label>
            <DatePicker
              id="date"
              selected={startDate}
              onChange={(date) => setStartDate(date || new Date())}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Category</label>
            <input
              type="text"
              id="category"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Difficulty</label>
            <select
              id="difficulty"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="" disabled>Select a difficulty</option>
              <option value="Dragon">Dragon</option>
              <option value="Witch">Witch</option>
              <option value="Goblin">Goblin</option>
              <option value="Slime">Slime</option>
            </select>
          </div>
          <button
            type="submit"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Create
          </button>
        </form>

      
      </div>
    </div>
  );
}
