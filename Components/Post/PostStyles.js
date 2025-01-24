
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  postContainer: {
      backgroundColor: 'white',
      padding: 15,
      marginVertical: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
  },
  userName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
  },
  postDate: {
      fontSize: 12,
      color: '#999',
  },
  postContent: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
      lineHeight: 20,
  },
  postImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      paddingTop: 10,
  },
  actionButton: {
      alignItems: 'center',
  },
  actionText: {
      fontSize: 14,
      color: '#007bff',
      fontWeight: '600',
  },
});