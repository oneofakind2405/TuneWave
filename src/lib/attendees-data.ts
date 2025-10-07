
// This is a mock database of event attendees.
// The key is the event ID, and the value is an array of user IDs attending that event.

type AttendeesData = {
    [eventId: string]: string[];
};

export const attendeesData: AttendeesData = {
    '1': ['user-jane', 'user-john', 'user-chloe'],
    '2': ['user-liam', 'user-mike'],
    '3': ['user-liam', 'user-john', 'user-jane', 'user-chloe', 'user-mike'],
    '4': ['user-jane', 'user-mike'],
    '5': ['user-liam', 'user-jane', 'user-john'],
    '6': ['user-john', 'user-chloe'],
    '7': ['user-mike'],
    '8': ['user-jane', 'user-liam'],
    '9': ['user-john', 'user-mike'],
    '10': ['user-liam', 'user-jane', 'user-chloe'],
    '11': [],
    '12': ['user-liam', 'user-jane', 'user-john', 'user-chloe', 'user-mike'],
    '13': ['user-john', 'user-liam'],
    '14': ['user-jane', 'user-chloe', 'user-mike'],
    '15': ['user-liam'],
    '16': ['user-jane', 'user-john'],
};

export function getAttendeesCount(eventId: string): number {
    return attendeesData[eventId]?.length || 0;
}

    