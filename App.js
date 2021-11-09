import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
  Alert,
    Keyboard, TouchableWithoutFeedback
} from "react-native";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { MaterialIcons } from "@expo/vector-icons";

const COLORS = { primary: "#1f145c", white: "#fff" };

export default function App() {
    const [todo, setTodo] = useState([
        { id: 1, task: "first Todo", completed: false },
        { id: 2, task: "second Todo", completed: false },
    ]);
    useEffect(() => {
        getTodoFromUserPhone;
    }, []);

    useEffect(() => {
        saveTodoToUserPhone(todo);
    }, [todo]);

    const [input, setInput] = useState("");

    const addTodo = () => {
        if (input == "") {
            Alert.alert("Error", "Please input todo");
        } else {
            const newTodo = {
                id: Math.random(),
                task: input,
                completed: false,
            };
            Alert.alert("Sucess", "Todo added sucessfully");
            setTodo([newTodo, ...todo]);
            setInput("");
        }
    };

    const todoComplete = (todoID) => {
        const newTodo = todo.map((item) => {
            if (item.id == todoID) {
                return { ...item, completed: true };
            } else {
                return item;
            }
        });
        setTodo(newTodo);
    };

    const deleteTodo = (todoID) => {
        const newTodo = todo.filter((item) => item.id != todoID);
        Alert.alert("Sucess", "Todo deleted sucessfully");

        setTodo(newTodo);
    };

    const clearTodo = () => {
        Alert.alert("Confirm", "Clear Todo List?", [
            {
                text: "Yes",
                onPress: () => setTodo([]),
            },
            { text: "No" },
        ]);
    };

    const saveTodoToUserPhone = async (todos) => {
        try {
            const stringifyTodos = JSON.stringify(todos);
            await AsyncStorage.setItem("todo", stringifyTodos);
        } catch (e) {
            console.log(e);
        }
    };

    const getTodoFromUserPhone = async () => {
        try {
            const todos = await AsyncStorage.getItem("todo");
            if (todo != null) {
                setTodo(JSON.parse(todo));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const ListItem = ({ todo }) => {
        return (
            <View style={styles.ListItem}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            textDecorationLine: todo.completed
                                ? "line-through"
                                : "none",
                        }}
                    >
                        {todo?.task}
                    </Text>
                </View>
                {!todo?.completed && (
                    <TouchableOpacity style={[styles.actionIcon]}>
                        <MaterialIcons
                            name="done"
                            size={24}
                            color="white"
                            onPress={() => todoComplete(todo?.id)}
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.actionIcon]}
                    style={{ backgroundColor: "red", marginLeft: 10 }}
                >
                    <MaterialIcons
                        name="delete"
                        size={24}
                        color="white"
                        onPress={() => deleteTodo(todo?.id)}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: COLORS.white }}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerText}>TODO APP</Text>
                        {todo.length !== 0 && (
                            <MaterialIcons
                                size={25}
                                color="red"
                                name="delete"
                                onPress={clearTodo}
                            />
                        )}
                    </View>
                    {todo.length === 0 && (
                <View style={{ flex: 1, justifyContent:"center", alignItems:"center"}}>
                            <Text style={{fontSize:20}}>
                                Your todo list empty, start by adding Todos
                            </Text>
                        </View>
                    )}
                    <FlatList
                        data={todo}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <ListItem todo={item} />}
                        contentContainerStyle={{
                            padding: 20,
                            paddingBottom: 100,
                        }}
                    />

                    <View style={styles.footer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Add Todo"
                                value={input}
                                onChangeText={(text) => setInput(text)}
                            />
                        </View>
                        <TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <MaterialIcons
                                    name="add"
                                    size={30}
                                    color="white"
                                    onPress={addTodo}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    actionIcon: {
        height: 25,
        width: 25,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
        borderRadius: 3,
    },
    header: {
        padding: 20,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        marginTop: 20,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20,
        color: COLORS.primary,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        color: COLORS.white,
        backgroundColor: COLORS.white,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    inputContainer: {
        backgroundColor: COLORS.white,
        elevation: 40,
        flex: 1,
        height: 50,
        marginVertical: 20,
        marginRight: 20,
        borderRadius: 30,
        paddingHorizontal: 20,
    },
    iconContainer: {
        height: 50,
        width: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        elevation: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    ListItem: {
        padding: 20,
        backgroundColor: COLORS.white,
        flexDirection: "row",
        elevation: 12,
        borderRadius: 7,
        marginVertical: 7,
    },
});
