import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, TextInput, FlatList, Text, Alert } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Details = ({ route, navigation }) => {

  const [data, setData] = useState({
    id: uuid.v4(),
    title: "",
    subData: []
  })

  const [subValue, setSubValue] = useState('')
  const dataSavedHandler = async () => {
    if (!data.title.trim()) {
      return Alert.alert(
        "Required",
        "Please enter the Title",
        [
          {
            text: "Close"
          }
        ]
      );
    }
    try {
      const value = await AsyncStorage.getItem('To-Do_Lists');
      if (value !== null) {
        const storage = JSON.parse(value)
        await AsyncStorage.setItem(
          'To-Do_Lists',
          JSON.stringify([...storage, data])
        );
        navigation.push('ToDoPage', { return: true })
        setData({ id: '', title: '', subData: [] })
        setSubValue('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const subDataSavedHandler = () => {
    setData(prev => (
      {
        ...prev,
        subData: [
          {
            id: uuid.v4(),
            value: subValue,
            done: false
          },
          ...prev.subData
        ]
      }
    ))
    setSubValue('')
  }

  const onChangeText = (e) => {
    setData(prev => ({ ...prev, title: e }))
  }

  const onChangeItem = (e) => {
    setSubValue(e)
  }

  const deleteItem = (ID) => {
    const updateArray = data.subData.map(item => {
      if (item.id === ID) {
        item.done = true
        return item
      }
      else {
        return item
      }
    })
    setData(prev => (
      {
        ...prev,
        subData: updateArray
      }
    ))
  }

  const editItem = (ID) => {
    setSubValue(data.subData.filter(item => item.id === ID)[0].value)
    setData(prev => (
      {
        ...prev,
        subData: prev.subData.filter(item => item.id !== ID)
      }
    ))
  }

  const showConfirmDialog = () => {
    if (data.title.trim() || data.subData.length) {
      return Alert.alert(
        "Are your sure?",
        "Your data will be losses?",
        [
          {
            text: "Yes",
            onPress: () => {
              navigation.navigate('ToDoPage')
            },
          },
          {
            text: "No",
          },
        ]
      );
    }
    navigation.navigate('ToDoPage')
  };

  return (
    <View style={styles.main}>
      <View style={styles.detailsHeader}>
        <TouchableOpacity
          onPress={showConfirmDialog}
          style={styles.Button}
        >
          <Feather name="chevron-left" color="black" size={34} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={dataSavedHandler}
          style={[styles.Button, { marginRight: 8 }]}
        >
          <Feather name="check" color="black" size={34} />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsMain}>
        <TextInput
          style={styles.inputTitle}
          onChangeText={onChangeText}
          value={data.title}
          placeholder="Title"
          autoComplete='off'
          autoFocus
        />
        <View style={styles.inputFiled}>
          <TextInput
            style={styles.inputItem}
            onChangeText={onChangeItem}
            value={subValue}
            placeholder="Item Name"
            autoComplete='off'
          />
          <TouchableOpacity
            onPress={subDataSavedHandler}
            style={styles.AddButton}
          >
            {subValue.length > 2 ? <Feather name="check" color="black" size={22} /> : null}
          </TouchableOpacity>
        </View>
        {data.subData.length > 0 ?
          <FlatList
            data={data.subData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              <View style={styles.dataList}>
                <Text style={item.done ? styles.dataListTextDone : styles.dataListText}>{item.value}</Text>
                {!item.done ?
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
                  : null}
              </View>
            }
            keyExtractor={item => item.id}
            style={styles.dataListContainer}
          />
          : null}
      </View>
    </View>
  )
}

export default Details

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailsHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 36,
  },
  BuAddtton: {
    marginTop: 36,
    marginBottom: 8,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsMain: {
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
    height: "90%"
  },
  inputTitle: {
    height: 50,
    marginTop: 10,
    marginLeft: 2,
    padding: 10,
    fontSize: 24,
    letterSpacing: 1.6,
  },
  inputFiled: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
  },
  inputItem: {
    width: "80%",
    padding: 8,
    fontSize: 18,
    letterSpacing: 1,
  },
  AddButton: {
    marginRight: 16
  },
  dataListContainer: {
    marginTop: 8,
    width: "100%"
  },
  dataList: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dataListTextDone: {
    fontSize: 18,
    letterSpacing: 1,
    marginLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    color: "gray",
    textTransform: "capitalize",
    textDecorationLine: "line-through"
  },
  dataListText: {
    fontSize: 18,
    letterSpacing: 1,
    marginLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    textTransform: "capitalize",
    width: "80%"
  }
})