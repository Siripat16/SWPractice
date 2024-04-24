import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function EventScreen({ navigation }) {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState(''); // <-- Added state for job input
    const [slots, setSlots] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [label, setLabel] = useState('');

    const addJob = () => {
        if (job.trim() !== '' && jobs.indexOf(job) === -1) {
            setJobs([...jobs, job]);
            setJob(''); // Clear job input after adding
        }
    };

    const addSlot = () => {
        const newSlot = {
            startTime,
            endTime,
            label
        };
        setSlots([...slots, newSlot]);
        setStartTime('');
        setEndTime('');
        setLabel('');
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                eventTitle,
                eventDescription,
                jobs,
                slot: slots, // Corrected field name to "slot"
                companyID: "662816b22636f5fd10e19b60" // Assuming you have the company ID
            };
    
            const response = await fetch('http://127.0.0.1:2000/api/v1/events/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                },
                body: JSON.stringify(payload)
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                // Handle success response, e.g., show success message, navigate to another screen, etc.
                console.log('Event created successfully:', responseData);
                // Navigate back to the dashboard
                navigation.navigate('Dashboard');
            } else {
                // Handle error response, e.g., show error message
                console.error('Failed to create event:', responseData);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error creating event:', error);
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Create Event</Text>
            <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={eventTitle}
                onChangeText={setEventTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Event Description"
                multiline
                numberOfLines={4}
                value={eventDescription}
                onChangeText={setEventDescription}
            />
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Jobs Available</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Job Title"
                    value={job}
                    onChangeText={setJob}
                />
                <TouchableOpacity style={styles.addButton} onPress={addJob}>
                    <Text style={styles.addButtonText}>Add Job</Text>
                </TouchableOpacity>
                <Text style={styles.sectionContent}>{jobs.join(', ')}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Event Slots</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Start Time"
                    value={startTime}
                    onChangeText={setStartTime}
                />
                <TextInput
                    style={styles.input}
                    placeholder="End Time"
                    value={endTime}
                    onChangeText={setEndTime}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Label"
                    value={label}
                    onChangeText={setLabel}
                />
                <TouchableOpacity style={styles.addButton} onPress={addSlot}>
                    <Text style={styles.addButtonText}>Add Slot</Text>
                </TouchableOpacity>
                {slots.map((slot, index) => (
                    <Text key={index} style={styles.sectionContent}>{slot.label}: {slot.startTime} - {slot.endTime}</Text>
                ))}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Create Event</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContent: {
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: 'green',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
