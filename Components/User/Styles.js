import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerLogo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
    },
    header: {
        marginTop: 60,
    },

    titleText: {
        fontWeight: "bold",
        fontSize: 35,
        textAlign: 'center',
        marginTop: 25,
        color: '#0033CC',
    },

    subTitleText: {
        marginTop: 10,
        fontSize: 15,
        textAlign: 'center',
    },

    form: {
        marginTop: 40,
        marginBottom: 50,
    },

    inputLabel: {
        fontWeight: "bold",
        fontSize: 18,
    },

    inputControl: {
        backgroundColor: 'white',
        marginTop: 15,
        borderRadius: 18,
        fontWeight: '500',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%', // Sửa lỗi chính tả 'widtd' -> 'width'
    },

    button: {
        backgroundColor: '#0099FF',
        borderRadius: 10,
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },

    textButton: {
        fontSize: 20,
        color: '#FFFFFF',
    },

    textFooter: {
        fontSize: 15,
        textAlign: 'center',
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
    },

    iconContainer: {
        padding: 10,
    },
});
