import { useState } from 'react';
import { ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client';
import BookItem from '@/components/BookItem';

const query = gql`
query SearchBooks($q: String) {
  googleBooksSearch(q: $q, country: "US") {
    items {
      id
      volumeInfo {
        authors
        averageRating
        description
        imageLinks {
          thumbnail
        }
        title
        subtitle
        industryIdentifiers {
          identifier
          type
        }
      }
    }
  }
  openLibrarySearch(q: $q) {
    docs {
      author_name
      title
      cover_edition_key
      isbn
    }
  }
}
`;

export default function TabOneScreen() {
  const {colors} = useTheme()
  const [searchItem, setSearchItem] = useState('')
  const [runQuery, {data, loading, error}] = useLazyQuery(query, {variables: {q : searchItem}})
  const [provider, setProvider] = useState("googleBooksSearch")

  function parseBooks(item :any ) :Book{
    if(provider == "googleBooksSearch"){
      return {
        image: item.volumeInfo.imageLinks?.thumbnail, 
        title: item.volumeInfo.title, 
        authors: item.volumeInfo.authors, 
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier
      }
    }
    return {
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors: item.author_name,
      isbn: item.isbn?.[0]
    }
  }

  return(
    <View style={styles.outterContainer}>
      <View style={styles.header}>
        <TextInput placeholder='Search...' style={[styles.input, {color: colors.text}]} value={searchItem} onChangeText={setSearchItem}/>
        <Button title='Search' onPress={() => runQuery({variables : {q :searchItem}})}/>
      </View>
      <View style={styles.tabs}>
        <Text onPress={()=>setProvider("googleBooksSearch")} style={provider == "googleBooksSearch" ? {color: 'royalblue', fontWeight: 'bold'} : {}}>
          Google Books
        </Text>
        <Text onPress={()=>setProvider("openLibrarySearch")} style={provider == "openLibrarySearch" ? {color: 'royalblue', fontWeight: 'bold'} : {}}>
          Open Library
        </Text>
      </View>
      {loading && <ActivityIndicator/>}
      {error && (
        <View style={styles.container}>
          <Text>Error Fetching book!</Text>
          <Text>{error?.message}</Text>
        </View>
      )}
      <FlatList 
        data={(provider == 'googleBooksSearch' ? data?.googleBooksSearch?.items : data?.openLibrarySearch?.docs) || []}
        renderItem={({ item }) => <BookItem book={parseBooks(item)}/>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  outterContainer : {
    padding: 5
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input :{
    flex: 1,
    borderWidth: 1,
    borderColor: "gainsboro",
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    alignItems: 'center'
  }
});
