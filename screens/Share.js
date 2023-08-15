import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getContents } from '../services/user';
import Content from '../components/Content';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function Share() {
  const [contents,setContents] = useState(null);
  useEffect(()=> {
    getContents()
    .then((contents) => {
      setContents(contents)
      })
    .catch((err) => {
      console.log(err)
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    });
  }, []);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {
        contents?.length > 0 ?
        <FlatList
          data={contents}
          keyExtractor={item => item._id.toString()}
          renderItem={content => <Content content={content.item}/>}
        />
        : 
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10, color: 'gray'}}>Looks like you haven't posted anything yet.</Text>
      }
    </View>
  )
}
