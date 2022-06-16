import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
// import {  SafeAreaView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Colors = { primary: '#1f145c', white: '#fff' };

const App = () => {
  const [textInput, setTextInput] = React.useState('');
  const [todos, setTodos] = React.useState([]);
  const [edit, setedit]= React.useState(0);
  React.useEffect(() => {
    getTodosFromUserDevice();
  } , [] );
  React.useEffect(() => {saveTodo(todos)
  }, [todos]);



  const ListItem = ({ todo }) => {

    return (

      <View style={styles.listItem}>
        <View style = {{ flex:1  }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: Colors.primary,
            textDecorationLine: todo?.completed ? 'line-through' : 'none',
          }}>
            {todo?.task} </Text>
        </View>
        {
          !todo?.completed && 
          ( <TouchableOpacity style= {[styles.actionIcon]} onPress={()=>markTodoComplete(todo?.id)}>
          <Icon name="done" size={20} color = {Colors.white} />
        </TouchableOpacity>
          )}
        
        <TouchableOpacity style= {[styles.actionIcon, {backgroundColor:"red"}]} onPress={()=>deleteTodo(todo?.id) }>
          <Icon name="delete" size={20} color = {Colors.white} />
        </TouchableOpacity>

      </View>
    );
  };

  const addTodo = () =>{
    if(textInput == ''){
      Alert.alert('Error', 'Please Input todo');
    }
    else{

      const newTodo = {
        id:Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos,newTodo]);
      setTextInput('');
    }
  };


const markTodoComplete = (todoId)=>{

  const newTodos = todos.map(item =>{
    if(item.id==todoId){
      return {...item, completed:true}
    }
    return item;
  });
  setTodos(newTodos);
};


const updateitem = (item) => {
  setedit(todos.id);
};

const updateList = () => {
  setTodos((item => getItem.map(item => item.id ) ))
}


const deleteTodo = (todoId) =>{
  const newTodos = todos.filter(item =>item.id != todoId);
  setTodos(newTodos)
};


const clearTodos = () =>{
  Alert.alert("Confirm", "Clear Todos?", [
    {
      text: 'Yes',
      onPress:() => setTodos([]),
    },
    {
      text: 'No'
    },
  ]);
};


const saveTodo = async todos =>{
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      console.log(e);
    }
  };

  const getTodosFromUserDevice = async() => {
  try{
    const todos = await AsyncStorage.getItem('todos');
    if(todos != null){
      setTodos(JSON.parse(todos));
    }
  }catch (error){
    console.log(error)
  }
};





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: Colors.primary }}>
          TODO APP
        </Text>
        <Icon name="delete" size={25} color="red" onPress={clearTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Add Todo"
          value = {textInput}
          onChangeText={(text)=> setTextInput(text)} />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={Colors.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  actionIcon:{
    height: 25,
    width:25,
    backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:5,
    borderRadius:7,
    marginVertical:10,
  },
  
  listItem: {
    padding: 20,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  inputContainer: {
    backgroundColor: Colors.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
