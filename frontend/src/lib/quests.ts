import axios from 'axios';
import { array, number, object, parse, string } from 'valibot'

export interface Quest {
    id: number;
    name: string;
    description: string;
    createDate: Date;
    endDate: Date;
    completed: boolean;
    difficulty: string;
    category: string;
    userId: number;
  }

export async function getAllQuests(userId: string) {
  const response = await axios.get(`http://localhost:3000/api/quest/${userId}`);
  const quests = response.data;
  return quests;
}