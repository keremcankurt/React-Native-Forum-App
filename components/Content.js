import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function Content({content}) {
    const navigation = useNavigation()
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Content', {contentId: content?._id})}>
        <View style={styles.content}>
            <Text style={styles.title}>{content?.title}</Text>
            <Text style={styles.desc}>{content?.description?.length > 50 ? content.description.substring(0, 50) + "..." : content.description}</Text>
            <View style={styles.infos}>
                <TouchableOpacity style={styles.author} onPress={() => navigation.navigate('User', {id: content?.user?.id})}>
                    <Ionicons name="person" size={20} color="black" />
                    <Text style={{color: '#222'}}>{content.user.name}</Text>
                </TouchableOpacity>
                <Text style={styles.commentsNumber}><Ionicons name="chatbubble" size={20} color="gray" /> {content.comments.length}</Text>
                <Text style={styles.createdAt}><Ionicons name="calendar-outline" size={20} color="gray" />{new Date(content.createdAt).toLocaleDateString()}</Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
        width: 2,
        height: 0
        },
        shadowOpacity: .2,
        shadowRadius: 5,
        elevation: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 10,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10
    },
    desc: {
        color: '#666',
        marginBottom: 10,
        overflow: 'hidden',
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
    commentsNumber: {
        marginRight: 10,
        color: '#666',
    },
    createdAt: {
        color: '#666',
    }
  });
