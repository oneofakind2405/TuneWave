
export type User = {
  id: string;
  name: string;
  email: string;
  initials: string;
  memberSince: string;
};

export const users: User[] = [
  {
    id: 'user-liam',
    name: 'Liam Ottley',
    email: 'liamottley@gmail.com',
    initials: 'LO',
    memberSince: '2025-07-01',
  },
  {
    id: 'user-jane',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    initials: 'JD',
    memberSince: '2025-06-15',
  },
  {
    id: 'user-john',
    name: 'John Smith',
    email: 'john.smith@example.com',
    initials: 'JS',
    memberSince: '2025-05-20',
  },
  {
    id: 'user-chloe',
    name: 'Chloe Kim',
    email: 'chloe.kim@example.com',
    initials: 'CK',
    memberSince: '2025-04-10',
  },
  {
    id: 'user-mike',
    name: 'Mike Brown',
    email: 'mike.brown@example.com',
    initials: 'MB',
    memberSince: '2025-03-05',
  },
];

    