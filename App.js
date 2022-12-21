// GitHub repo for this project:
// https://github.com/JanSzczepan/react-native-interview

// I am humbly aware that my app doesn't have TypeScript support. I am currently taking course from which I will learn TypeScript and I will finally be able to use it in my projects.

import { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView, StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native'
import axios from 'axios'

// JSON placeholder API doesn't provide information about data count, so in this case I have to hardcode it
const COUNT = 199

// ListItem component
export const ListItem = ({ item }) => {
   const { title } = item

   return (
      <View>
         <Text>{title}</Text>
      </View>
   )
}

const App = () => {
   // State for data and loading info
   const [toDoState, setToDoState] = useState({ data: [], isLoading: true })

   // Unfortunately API endpoint that you provided doesn't seem to be working so I used JSON placeholder API which provides similar data.
   const url = 'https://jsonplaceholder.typicode.com/todos'
   const API = axios.create({ baseURL: url })

   // Function which fetches data from API endpoint
   const fetchData = async (start, limit) => {
      if (typeof start === 'number' && typeof limit === 'number' && start >= 0 && limit >= 1) {
         setToDoState((prevState) => ({ ...prevState, isLoading: true }))

         const { data } = await API.get(`?_start=${start}&_limit=${limit}`)

         setToDoState((prevState) => ({ data: [...prevState.data, ...data], isLoading: false }))
      }
   }

   // Fetch initial data only when app loads for the first time
   useEffect(() => {
      if (!toDoState.data.length) {
         fetchData(0, 20)
      }
   }, [])

   return (
      <SafeAreaView style={styles.container}>
         {toDoState.isLoading && !toDoState.data.length ? (
            <ActivityIndicator />
         ) : (
            <>
               <FlatList
                  style={styles.list}
                  data={toDoState.data}
                  renderItem={({ item }) => (
                     <ListItem
                        style={styles.listItem}
                        item={item}
                     />
                  )}
                  keyExtractor={(item) => item.id}
                  onEndReached={() => !toDoState.isLoading && toDoState.data.length < COUNT && fetchData(toDoState.data.length + 1, 20)}
               />
               {toDoState.isLoading && <ActivityIndicator />}
            </>
         )}

         <StatusBar style="auto" />
      </SafeAreaView>
   )
}

export default App

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   list: {
      width: '100%',
      height: '100%',
   },
   listItem: {
      width: '100%',
      height: '40px',
      padding: '8px',
      alignItems: 'flexStart',
   },
})
