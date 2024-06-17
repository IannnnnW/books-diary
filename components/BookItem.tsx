import Colors from '@/constants/Colors';
import { useBooksContext } from '@/contexts/BooksContext';
import { Pressable } from 'react-native';
import { View, Image, Text } from 'react-native'
import { StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native';

type BookItemProps = {
    book :Book;
}

const BookItem = ({book} :BookItemProps)=>{
    const {isSaved, toggleIsSaved} = useBooksContext()
    const {colors} = useTheme()
    return(
        <View style={styles.container}>
            <Image source={{ uri: book.image }} style={styles.image}/>
            <View style={styles.contentContainer}>
                <Text style={{color: colors.text}}>{book.title}</Text>
                <Text style={{color: colors.text}}>by {book.authors?.join(", ")}</Text>
                <Pressable onPress={()=>toggleIsSaved(book)} style={[styles.button, isSaved(book) ? {backgroundColor: 'lightgrey'} : {}]}>
                    <Text style={styles.buttonText}>{isSaved(book) ? 'Remove' : 'Want to Read'}</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.tint,
        alignSelf: "flex-start",
        marginTop: "auto",
        marginVertical: 18,
        padding: 7,
        paddingHorizontal: 15,
        borderRadius: 5
    },
    buttonText : {
        color: "white",
        fontWeight: "600"
    },
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