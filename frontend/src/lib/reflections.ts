import axios from 'axios';
import { array, number, object, parse, string } from 'valibot'

export interface Reflection {
    id: number;
    date: Date;
    message: string;
    questId: number;
}

export async function getAllReflections(questId: string) {
    const response = await axios.get(`http://localhost:3000/api/reflection/${questId}`);
    const reflections = response.data;
    console.log('reflections:', reflections);
    return reflections;
}