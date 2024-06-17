import { StyleSheet, FlatList } from 'react-native';
import { useBooksContext } from '@/contexts/BooksContext';
import { Text, View } from '@/components/Themed';
import BookItem from '@/components/BookItem';

export default function TabTwoScreen() {
  const { savedBooks } = useBooksContext()
  return (
    <View style={styles.container}>
      <FlatList
      data={savedBooks}
      renderItem={({item}) => <BookItem book={item}/>}
      showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  }
});
