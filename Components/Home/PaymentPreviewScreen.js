import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useContext } from "react"
import { CurrentAccountUserContext } from '../../App';

const PaymentPreviewScreen = ({ navigation }) => {

    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)

    const expiryDate = currentAccountUser.subscription_expiry_date ? new Date(currentAccountUser.subscription_expiry_date).toLocaleDateString('vi-VN') : null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🌟 GÓI PREMIUM</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>✨ Lợi ích khi nâng cấp:</Text>
                <Text style={styles.feature}>✅  Tạo bài viết tự động bằng AI</Text>

            </View>

            <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>💰 Giá gói:</Text>
                <Text style={styles.price}>100.000 VNĐ / tháng</Text>
            </View>

            {expiryDate && (
                <View style={styles.expiryBox}>
                    <Text style={styles.expiryText}>📅 Gói Premium hết hạn vào: {expiryDate}</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={()=>{navigation.navigate('VNPayPaymentScreen')}}
            >
                <Text style={styles.buttonText}>🔒 Thanh toán hoặc gia hạn ngay!</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f0f4f7',
        flexGrow: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 100
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#111827',
    },
    feature: {
        fontSize: 16,
        marginVertical: 4,
        color: '#374151',
    },
    priceBox: {
        backgroundColor: '#fff7ed',
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
    },
    priceTitle: {
        fontSize: 16,
        color: '#92400e',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    expiryBox: {
        marginTop: 10,
        padding: 12,
        backgroundColor: '#e0f2fe',
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
      },
      expiryText: {
        fontSize: 16,
        color: '#0c4a6e',
        fontWeight: '500',
      },
});

export default PaymentPreviewScreen;