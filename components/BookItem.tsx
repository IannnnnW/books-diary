import { View, Image, Text } from 'react-native'
import { StyleSheet } from 'react-native'
type BookItemProps = {
    book :Book;
}

const BookItem = ({book} :BookItemProps)=>{
    return(
        <View style={styles.container}>
            <Image source={{ uri: book.image }} style={styles.image}/>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{book.title}</Text>
                <Text>by {book.authors?.join(", ")}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container :{
        flexDirection:"row",
        marginVertical: 10
    },
    image :{
        flex: 1,
        aspectRatio: 2 / 3,
        marginRight: 10
    },
    contentContainer:{
        flex: 4,
        borderColor: 'lightgray',
        borderBottomWidth: 0.5
    },
    title:{
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default BookItem