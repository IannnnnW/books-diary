import { useState } from 'react';
import { ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from 'react-native';
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
  const [searchItem, setSearchItem] = useState('')
  const [runQuery, {data, loading, error}] = useLazyQuery(query, {variables: {q : searchItem}})
  return(
    <View >
      <View style={styles.header}>
        <TextInput placeholder='Search...' style={styles.input} value={searchItem} onChangeText={setSearchItem}/>
        <Button title='Search' onPress={() => runQuery({variables : {q :searchItem}})}/>
      </View>
      {loading && <ActivityIndicator/>}
      {error && (
        <View style={styles.container}>
          <Text>Error Fetching book!</Text>
          <Text>{error?.message}</Text>
        </View>
      )}
      <FlatList 
        data={data?.googleBooksSearch?.items || []}
        renderItem={({ item }) => <BookItem book={{image: item.volumeInfo.imageLinks?.thumbnail, title: item.volumeInfo.title, authors: item.volumeInfo.authors, isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier}}/>}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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
    padding: 10,
    marginVertical: 5
  }
});
