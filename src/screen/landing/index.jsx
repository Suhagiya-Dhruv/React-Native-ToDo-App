import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react-native';
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = ({ navigation }) => {

  const [data, setData] = useState([])

  const deleteItem = async (ID) => {
    setData(data.filter(item => item.id !== ID))
    try {
      await AsyncStorage.setItem(
        'To-Do_Lists',
        JSON.stringify(data.filter(item => item.id !== ID))
      );
    } catch (error) {
      console.log(error)
    }
  }

  const editItem = (ID) => {

  }
  useEffect(() => {
    async function fetch() {
      try {
        const value = await AsyncStorage.getItem('To-Do_Lists');
        if (value !== null) {
          setData(JSON.parse(value))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetch();
  }, [])

  return (
    <View style={styles.mainContainer}>
      <View style={styles.boxShadow}>
        <Text style={styles.mainTitle}>To-Do List</Text>
      </View>
      {data.length > 0 ?
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <View style={styles.dataList}>
              <Text style={styles.dataListText}>{item.title}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', marginRight: "4%" }}>
                <TouchableOpacity
                  onPress={() => editItem(item.id)}
                >
                  <Feather name="edit" color="green" size={22} style={{ paddingRight: "4%" }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                >
                  <Feather name="trash-2" color="red" size={22} />
                </TouchableOpacity>
              </View>
            </View>
          }
          keyExtractor={item => item.id}
          style={styles.dataListContainer}
        />
        :
        <View style={styles.lottieImage}>
          <Text style={styles.firstList}>Create Your Lists</Text>
          <Lottie source={require('../../lottie/noData.json')} autoPlay autoSize loop />
        </View>
      }
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NewAdd')}
        >
          <Feather name="plus-circle" color="purple" size={50} />
        </TouchableOpacity>
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  mainTitle: {
    marginTop: 36,
    fontSize: 32,
    paddingLeft: 16,
    paddingBottom: 16
  },
  boxShadow: {
    elevation: 2,
    borderColor: "black"
  },
  lottieImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  firstList: {
    fontSize: 24
  },
  icons: {
    elevation: 1,
    borderColor: "gray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  dataListContainer: {
    width: "100%",
    height: "80%",
  },
  dataList: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 8,
    elevation: 2,
    borderRadius: 4,
    backgroundColor: "white"
  },
  dataListText: {
    fontSize: 24,
    marginLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    textTransform: "capitalize"
  }
});

export default Index;