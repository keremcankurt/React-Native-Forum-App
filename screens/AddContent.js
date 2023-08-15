import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContents } from '../context/ContentContext';
import { addContent } from '../services/content';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function AddContent() {
    const { contents, setContents } = useContents();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const navigation = useNavigation()
    const handleAddContent = () => {

        if(!title || !desc) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please fill in the valid fields',
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
            return
        }
        const newContent = {
            title,
            desc
        }
        addContent(newContent)
        .then((res) => {
            Toast.show({
                type: 'success',
                text1: 'Add Content',
                text2: res.message,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
          setTitle('');
          setDesc('');
          setContents([...contents, res.content]);
          navigation.goBack()
        })
        .catch((err) => {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: err.message,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        });
      }
  return (
    <SafeAreaView>
        <View style={styles.container}>
            <TextInput
                style={styles.title}
                placeholder="What would you like to ask?"
                placeholderTextColor="#00000030"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.textArea}
                multiline={true}
                numberOfLines={4}
                placeholder="Enter a description..."
                value={desc}
                onChangeText={setDesc}
            />
            <TouchableOpacity style={styles.share} onPress={handleAddContent}>
                <Text style={{color: '#fdfcfc'}}>Share</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        gap: 10,
    },
    title: {
        textAlign: 'left',
        paddingLeft: 10,
        paddingVertical: 5,
        backgroundColor: '#ebebeb',
        borderWidth: 1,
        color: '#696868',
        borderColor: 'gray',
        width: '70%',
        borderRadius: 5
    },
    textArea: {
        width: '70%',
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    share: {
        backgroundColor: '#1f91fc',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    }
  });
