import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TouchableHighlight, 
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import React,{useState, useEffect} from "react";
import {theme} from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
//expo install @react-native-async-storage/async-storage
//remenber where I stopped
//make complete btn
//make edit btn
const STORAGE_KEY = "@lists";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [lists, setLists] = useState({});
  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };
  const onChangeText = (payload) => {
    setText(payload);
  };

  const saveLists = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const addList = async () => {
    if(text == ""){
      return;
    }
    const newLists = Object.assign({}, lists, {[Date.now()]: {text, work: working}});
    setLists(newLists);
    await saveLists(newLists);
    setText("");
  };
  const loadLists = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if(s){
      setLists(JSON.parse(s));
    }
  };
  useEffect(() => {
    loadLists();
  },[]);
  const deleteList = (key) => {
    Alert.alert(
      "Delete To Do", 
      "Are you sure?", 
      [
        {
          text: "Yes",
          onPress: async() => {
            const newLists = {...lists};
            delete newLists[key];
            setLists(newLists);
            await saveLists(newLists);
          },
        },
        {text: "Cancel"}
      ]
    )
    return;
    
  };
  


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? ("white"): theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.grey: "white" }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={addList}
          onChangeText={onChangeText}
          returnKeyType="done"
          value = {text}
          placeholder={working ? "Add a To Do" : "Add Where You Wanna Travel"} 
          style={styles.input}
        >
        </TextInput>
        <ScrollView>
          {Object.keys(lists).map((key) => 
            (lists[key].work === working ? (<View style ={styles.list} key ={key}>
              <Text style = {styles.text}>{lists[key].text}</Text>
              <TouchableOpacity onPress={() => deleteList(key)}>
                <Feather name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>) : null))
          }
        </ScrollView>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
  },
  header:{
    marginTop: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnText:{
    fontSize: 30,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize:15,
  },
  list: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingTop: 23,
    paddingHorizontal: 18,
    borderRadius: 15,
    flexDirection: "row",
    alignItem: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
