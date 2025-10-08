
import { Timestamp } from "firebase/firestore";

export type Event = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  location: string;
  date: string; // Keep as string for form compatibility
  time: string;
  category: 'Rock' | 'Pop' | 'Electronic';
  imageUrl: string;
  imageHint: string;
  viewCount?: number;
  createdAt: Timestamp;
  latitude: number;
  longitude: number;
};

// This file is now used for type definitions, mock data is no longer needed.
