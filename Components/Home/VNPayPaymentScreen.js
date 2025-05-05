import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { getPaymentLink, updateAccountt } from '../../configs/API/userApi';
import { getToken } from '../../configs/api';
import { CurrentAccountUserContext } from "../../App";



const VNPayPaymentScreen = ({ navigation }) => {
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [token, setToken] = useState(null);
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
            console.log(token)
        };
        fetchToken();
    }, []);

    useEffect(() => {
        const fetchPaymentUrl = async () => {
            try {
                const data = await getPaymentLink(token);
                setPaymentUrl(data.payment_url);
            } catch (error) {
                console.error('Lỗi khi gọi API thanh toán:', error);
                Alert.alert('Lỗi', 'Không thể tạo liên kết thanh toán.');
            }
        };

        fetchPaymentUrl();
    }, [token]);

    const handleNavigationChange = async (navState) => {
        const { url } = navState;
        if (url.includes('/vnpay-return/')) {
            const parsedUrl = new URL(url);
            const responseCode = parsedUrl.searchParams.get('vnp_ResponseCode');
            const transactionStatus = parsedUrl.searchParams.get('vnp_TransactionStatus');
            if (token != null) {
                if (responseCode === '00' && transactionStatus === '00') {
                    try {
                        const now = new Date();
                        const currentExpiry = currentAccountUser.subscription_expiry_date
                            ? new Date(currentAccountUser.subscription_expiry_date)
                            : null; //Lay ngay het han

                        const baseDate = (currentExpiry && !isNaN(currentExpiry.getTime())) ? currentExpiry : now;
                        const newExpiryDate = new Date(baseDate.setDate(baseDate.getDate() + 30)).toISOString();

                        const data = {
                            subscription_status: 'Active',
                            subscription_expiry_date: newExpiryDate,
                        };

                       const response = await updateAccountt(token, currentAccountUser.user.id, data);
                       setCurrentAccountUser(response);

                        Alert.alert('Thành công', 'Bạn đã thanh toán thành công!');
                    }
                    catch (error) {
                        console.error('Lỗi khi gọi API cập nhật thanh toán:', error);
                    }


                } else {
                    Alert.alert('Thất bại', 'Thanh toán không thành công. Vui lòng thử lại');
                }

                navigation.navigate('AllView', { screen: 'Account' });
            }
        }
    };


    if (!paymentUrl) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Đang tạo liên kết thanh toán...</Text>
            </View>
        );
    }

    return (
        <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState
        />
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VNPayPaymentScreen;