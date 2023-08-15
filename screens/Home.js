import { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getContents } from "../services/content";
import Content from "../components/Content";
import Pagination from "../components/Pagination";
import { useNavigation } from "@react-navigation/native";
import { useContents } from "../context/ContentContext";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedOption, setSelectedOption] = useState('The Newest');
  const [isOpen, setIsOpen] = useState(false);

  const { contents, setContents } = useContents();

  useEffect(() => {
    getContents()
    .then((res) => {
        setContents(res);
    })
    .catch((err) => {
      alert(err.message);
    });
  },[]);
  const sortContents = (option) => {
    switch (option) {
      case 'The Newest':
        return contents?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'The Oldest':
        return contents?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'A-Z':
        return contents?.sort((a, b) => a.title?.localeCompare(b.title));
      case 'Z-A':
        return contents?.sort((a, b) => b.title?.localeCompare(a.title));
      case 'Comment Count':
        return contents?.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return contents;
    }
  };
  
  const filteredContents = sortContents(selectedOption)?.filter(content => content.title?.toLowerCase().includes(searchText.toLowerCase()));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContents?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <View style={styles.filterbar}>
              <TouchableOpacity style={styles.addContent} onPress={() => navigation.navigate('AddContent')}>
                <Text style={{color: '#444'}} numberOfLines={1}>New share</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.searchbar}
                placeholder="Search..."
                placeholderTextColor="#00000030"
                value={searchText}
                onChangeText={setSearchText}
              />
              <View style={styles.dropDownMenu}>
                <TouchableOpacity style={styles.dropDownButton} onPress={handleToggle}>
                  <Text style={{color: '#444'}} numberOfLines={1}>{selectedOption}</Text>
                </TouchableOpacity>
                {
                  isOpen &&
                  <View style={styles.dropDown}>
                    <TouchableOpacity style={styles.dropDownItem} onPress={() => handleOptionSelect('The Newest')}>
                      <Text style={{color: '#444'}}>The Newest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropDownItem} onPress={() => handleOptionSelect('The Oldest')}>
                      <Text style={{color: '#444'}}>The Oldest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropDownItem} onPress={() => handleOptionSelect('A-Z')}>
                      <Text style={{color: '#444'}}>A-Z</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropDownItem} onPress={() => handleOptionSelect('Z-A')}>
                      <Text style={{color: '#444'}}>Z-A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropDownItem}  onPress={() => handleOptionSelect('Comment Count')}>
                      <Text style={{color: '#444'}} numberOfLines={1}>Comment Count</Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>
          </View>
        </View>
        <View style={styles.contentsContainer}>
        {
          filteredContents?.length ? (
            <>
              <FlatList
                style={styles.contents}
                data={currentItems}
                keyExtractor={item => item._id.toString()}
                renderItem={content => <Content content={content.item}/>}
              />
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredContents.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )
          :
          <Text style={{fontSize: 20, textAlign: 'center', color: 'gray'}}>Would you like to make the first post?</Text>
        }
        </View>
    </SafeAreaView>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  safe: {
  maxHeight: windowHeight * 0.83
  },
  container:{
    display: 'flex',
    flexDirection: 'column',
    
    
  },
  searchContainer:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
  },
  filterbar: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: windowWidth * 0.05,
  },
  addContent: {
    backgroundColor: '#ddd',
    padding: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.23,
  },
  searchbar: {
    width: windowWidth * 0.35,
    padding: 5,
    backgroundColor: 'white'
  },
  dropDownMenu: {
    position: 'relative',
    width: windowWidth * 0.3,
  },
  dropDownButton: {
    backgroundColor: '#ddd',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
    alignItems: 'center'
  },
  dropDown: {
    position: 'absolute',
    width: '100%',
    top: 45,
    right: 0,
    backgroundColor: '#c9c9c9',
    alignItems: 'center',
    zIndex: 1,
    gap: 5,
    borderRadius: 5,
    padding: 5
  },
  dropDownItem: {
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    borderBottomColor: 'gray'
  },
  contentsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contents: {
  },
});
