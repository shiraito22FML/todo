
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
    TODObutton: {
        backgroundColor: 'skyblue',
        paddingVertical: 12,
        paddingHorizontal: 34,
        borderRadius: 48,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginHorizontal: 8,
        marginVertical: 8,
        padding: 20,
        marginBottom: 5,
        marginTop: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 30,
        textAlign: 'center',
    },
    listcontainer: {},
    taskItem: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 34,
        borderRadius: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: 5,
        marginTop: 5,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    delete: {
        fontSize: 20,
        color: "#cc9a9a",
    },
});

export default function HomeScreen() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('my-key');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (e) {
            console.error('Failed to load tasks from AsyncStorage', e);
        }
    };

    const addTask = async () => {
        if (!input) return; // Überprüfen, ob input nicht leer ist

        const newTasks = [...tasks, { id: Date.now().toString(), task: input }];
        setTasks(newTasks);
        setInput('');
        await storeData(newTasks);
    };

    const storeData = async (tasks) => {
        try {
            await AsyncStorage.setItem('my-key', JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks to AsyncStorage', e);
        }
    };

    const deleteTask = async (id) => {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
        await storeData(newTasks);
    };

    const renderdeleteTaskItem = ({ item }) => (
        <View style={style.taskItem}>
            <Text>{item.task}</Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={style.delete}>✖</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.1, backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 30, color: 'black' }}>ToDo Liste</Text>
            </View>

            <View style={{ padding: 10 }}>
                <TextInput
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        height: 40,
                        borderWidth: 0,
                        borderColor: "white",
                        backgroundColor: "white",
                        fontSize: 12,
                        marginHorizontal: 4,
                        color: '#000',
                    }}
                    placeholder="Type here to add a To-Do!"
                    onChangeText={setInput}
                    value={input}
                />
                <View style={{ padding: 5 }} />

                <TouchableOpacity style={style.TODObutton} onPress={addTask}>
                    <Text style={style.buttonText}>Add To-Do</Text>
                </TouchableOpacity>

                <FlatList
                    style={style.listcontainer}
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderdeleteTaskItem}
                />
            </View>
        </View>
    );
}
