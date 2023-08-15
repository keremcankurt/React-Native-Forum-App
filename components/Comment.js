import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Comment({comment}) {
    const navigation = useNavigation()
  return (
    <View style={styles.comment}>
        <Text >{comment?.text}</Text>
        <View style={styles.infos}>
            <TouchableOpacity style={styles.author} onPress={() => navigation.navigate('User', {id: comment?.user?.id})}>
                <Ionicons name="person" size={20} color="black" />
                <Text style={{color: '#222'}}>{comment.user.name}</Text>
            </TouchableOpacity>
                <Text style={styles.createdAt}><Ionicons name="calendar-outline" size={20} color="gray" />{new Date(comment.createdAt).toLocaleDateString()}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    comment: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 5,
        marginVertical: 10,
        padding: 10,
        gap: 10
    },
    infos: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        marginBottom: 10
    },
    author: {
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center',
        gap: 5
    },
    createdAt: {
        color: '#666',
    },
});
