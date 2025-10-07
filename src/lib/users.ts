
import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  initials: string;
  memberSince: Timestamp;
};
