import { EmergencyContact } from '../types';

export const emergencyContacts: EmergencyContact[] = [
    {
        id: '1',
        name: 'National Emergency Hotline',
        number: '911',
        category: 'hotline',
        icon: 'phone-alert',
        description: 'General emergency response',
    },
    {
        id: '2',
        name: 'Philippine Red Cross',
        number: '143',
        category: 'medical',
        icon: 'hospital',
        description: 'Medical emergencies and blood services',
    },
    {
        id: '3',
        name: 'Bureau of Fire Protection - San Juan',
        number: '(02) 8725-2079',
        category: 'fire',
        icon: 'fire-truck',
        description: 'Fire emergencies within San Juan',
    },
    {
        id: '4',
        name: 'San Juan PNP (Police)',
        number: '(02) 8724-2515',
        category: 'police',
        icon: 'shield-check',
        description: 'Police assistance and security',
    },
    {
        id: '5',
        name: 'San Juan City Hall',
        number: '(02) 8727-0711',
        category: 'barangay',
        icon: 'city',
        description: 'Local government assistance',
    },
    {
        id: '6',
        name: 'San Juan Medical Center',
        number: '(02) 8724-2611',
        category: 'medical',
        icon: 'ambulance',
        description: 'Public hospital in San Juan',
    },
];
