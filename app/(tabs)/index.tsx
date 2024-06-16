import { ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
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
  const {data, loading, error} = useQuery(query, {variables: {q : 'React Native'}})
  if(loading){
    return(
      <ActivityIndicator/>
    )
  }
  if(error){
    return(
      <View style={styles.container}>
        <Text>Error while fetching Books!</Text>
        <Text>{error.message}</Text>
      </View>      
    )
  }
  if(data){
    return(
      <FlatList 
        data={data?.googleBooksSearch?.items || []}
        renderItem={({ item }) => <BookItem book={{image: item.volumeInfo.imageLinks.thumbnail, title: item.volumeInfo.title, authors: item.volumeInfo.authors, isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0]?.identifier : null}}/>}
        showsVerticalScrollIndicator={false}
      />
    )
  }
  if(!data){
    return (
      <Text>Nothing to Show Here!</Text>
    )
  }
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
});
