
// This is a mock database of event attendees.
// The key is the event ID, and the value is an array of user IDs attending that event.

type AttendeesData = {
    [eventId: string]: string[];
};

export const attendeesData: AttendeesData = {
    '1': ['user-jane', 'user-john'],
    '2': ['user-liam'],
    '3': ['user-liam', 'user-john'],
    '4': ['user-jane'],
    '5': ['user-liam', 'user-jane', 'user-john'],
    '6': ['user-john'],
    '7': [],
    '8': ['user-jane'],
};

export function getAttendeesCount(eventId: string): number {
    return attendeesData[eventId]?.length || 0;
}
