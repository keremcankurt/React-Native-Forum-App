import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { getContent } from '../services/content';
import { addComment, getComments } from '../services/comment';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Ionicons } from '@expo/vector-icons';
import Pagination from '../components/Pagination';
import Comment from '../components/Comment';
import { useContents } from '../context/ContentContext';

export default function Content() {
  const route = useRoute();
  const contentId = route.params?.contentId;

  const [content, setContent] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentsLength, setCommentsLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);


  useEffect(() => {
    getContent(contentId)
    .then(content => {
        setContent(content);
        getComments(contentId)
        .then(comments => {
            setComments(comments);
            setCommentsLength(comments.length);
        })
        .catch(err => {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: err.message,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
        })
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
    })
}, [contentId])

const { contents, setContents } = useContents();
const handleSubmit = () => {
    if(comment.trim() === ""){
        Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'Please enter a comment',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
    }
        else{
            const newComment = {
                text: comment
            }
            addComment(newComment,contentId)
            .then((result) => {
                Toast.show({
                    type: 'success',
                    text1: 'Add Comment',
                    text2: result.message,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
                setComment("")
                setComments([...comments, result.comment]); 
                setCommentsLength(commentsLength+1);

                const newCommentId = result.comment._id;
                const contentToUpdate = contents.find(content => content._id === contentId);

                if (contentToUpdate) {
                    contentToUpdate.comments.push(newCommentId);
                    setContents([...contents]);
                }
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
            })
        }
    }
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const navigation = useNavigation()
  return (
    <ScrollView style={styles.container}>
        {
            content &&
            <>
               <View style={styles.content}>
                    <Text style={styles.title}>{content.title}</Text>
                    <Text style={styles.desc}>{content.description}</Text>
                    <View style={styles.infos}>
                        <TouchableOpacity style={styles.author} onPress={() => navigation.navigate('User', {id: content?.user?.id})}>
                            <Ionicons name="person" size={20} color="black" />
                            <Text style={{color: '#222'}}>{content.user.name}</Text>
                        </TouchableOpacity>
                        <Text style={styles.commentsNumber}><Ionicons name="chatbubble" size={20} color="gray" /> {commentsLength}</Text>
                        <Text style={styles.createdAt}><Ionicons name="calendar-outline" size={20} color="gray" />{new Date(content.createdAt).toLocaleDateString()}</Text>
                    </View> 
                </View>
                <View style={styles.commentSection}>
                    <View style={styles.comments}>
                        {
                            currentComments.map(comment => <Comment key={comment._id} comment={comment}/>)
                        }
                        <Pagination
                            itemsPerPage={commentsPerPage}
                            totalItems={comments.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </View>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.textArea}
                            multiline={true}
                            numberOfLines={4}
                            placeholder="Enter a comment..."
                            value={comment}
                            onChangeText={setComment}
                        />
                        <TouchableOpacity style={styles.send}>
                            <Text style={{color: '#ffffff'}} onPress={handleSubmit}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
            

        }
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
        margin: 0,
        marginHorizontal: 'auto',
        padding: 10,
    },
    content: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 2,
        height: 0
        },
        shadowOpacity: .2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    desc: {
        marginBottom: 20
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
    },
    commentSection: {
        marginTop: 10
    },
    textArea: {
        width: '100%',
        height: 70,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#aaa',
        marginBottom: 10
    },
    form: {
        marginVertical: 20
    },
    send: {
        backgroundColor: '#1f91fc',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    comments: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    }
  });
