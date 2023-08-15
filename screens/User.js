import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import { getUserProfile } from '../services/user';
import { getUserContents } from '../services/content';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Pagination from '../components/Pagination';
import Content from '../components/Content';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function User() {
    const route = useRoute();
    const id = route.params?.id;

    const [user, setUser] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    useEffect(() => {
        getUserProfile(id)
          .then((user) => {
            setUser({
              name: user.name,
              surname: user.surname,
              place: user.place,
              contents: [],
            });
            getUserContents(id)
              .then((userContents) => {
                setUser((prevState) => ({
                  ...prevState,
                  contents: userContents,
                }));
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
      }, [id]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user?.contents?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <ScrollView>
        <View style={styles.userPageWrapper}>
            <View style={styles.profile}>
                <Text style={styles.title}>Profile Informations</Text>
                <View style={styles.fullName}>
                    <Text style={styles.textName}>{user?.name}</Text>
                    <Text style={styles.textName}>{user?.surname}</Text>
                </View>
                <Text style={styles.text}>{user?.place || 'Unspecified'}</Text>
                <Text style={styles.contentCount}>Number of Posts: {user?.contents?.length || 0}</Text>
            </View>
            <View style={styles.contents}>
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Posts</Text>
                {
                    currentItems?.length > 0 ? 
                    (
                        <>
                            
                            {
                                currentItems.map(content => <Content key={content._id} content={content}/>)
                            }
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={user?.contents?.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </>
                    )
                    :
                    <Text style={{fontSize: 25, fontWeight: 'bold', color: 'gray', textAlign: 'center', marginTop: 10}}>User has no posts.</Text>
                    
                }
            </View>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    userPageWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10
    },
    profile: {
        borderWidth: 1,
        borderColor: 'rgba(95, 91, 91, 0.597)',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
        width: 2,
        height: 0
        },
        shadowOpacity: .2,
        shadowRadius: 5,
        elevation: 5,
        padding: 24,
        backgroundColor: "white",
        width: '95%',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    fullName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    text: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
        marginBottom: 16,
    },
    textName: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
        width: '45%',
    },
    contentCount: {
        backgroundColor: '#cecccc',
        paddingVertical: 10,
        color: '#4e4e4e',
        textAlign: 'center',
        borderRadius: 8,
        width: '50%',
        alignSelf: 'center',
    },
  });
