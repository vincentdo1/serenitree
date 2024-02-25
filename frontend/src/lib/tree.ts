import axios from 'axios';

export async function getTreeInformation(userId: string) {
    try {
        const response = await axios.get(`http://localhost:3000/api/plant/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch tree info for user ${userId}: ${error}`);
        return null;
    }
}