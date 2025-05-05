import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NUM_BATS = 8;

const FlyingBat = ({ delay = 0 }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const animate = () => {
        const xTo = (Math.random() < 0.5 ? -1 : 1) * (80 + Math.random() * 80);
        const yTo = -150 - Math.random() * 80;

        translateX.setValue(0);
        translateY.setValue(0);
        opacity.setValue(1);

        Animated.parallel([
            Animated.timing(translateX, {
                toValue: xTo,
                duration: 2000,
                useNativeDriver: false,
                easing: Easing.out(Easing.quad),
            }),
            Animated.timing(translateY, {
                toValue: yTo,
                duration: 2000,
                useNativeDriver: false,
                easing: Easing.out(Easing.quad),
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setTimeout(animate, 1000 + Math.random() * 2000); // Gọi lại sau một thời gian ngẫu nhiên
        });
    };

    useEffect(() => {
        const timer = setTimeout(animate, delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                opacity,
                transform: [{ translateX }, { translateY }],
            }}
        >
            <MaterialCommunityIcons
                name="bat"
                size={22 + Math.random() * 10}
                color="black"
            />
        </Animated.View>
    );
};


const GlowAvatar = ({ uri }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowColorAnim = useRef(new Animated.Value(0)).current;
    const pumpkinGlowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 700,
                    useNativeDriver: false,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: false,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.timing(glowColorAnim, {
                toValue: 1,
                duration: 1800,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pumpkinGlowAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(pumpkinGlowAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const glowColor = glowColorAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: ['#ff6600', '#ffcc00', '#ff3300', '#ff9900', '#ff6600'],
    });

    const pumpkinColor = pumpkinGlowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['orange', '#ffcc00'],
    });

    return (
        <View style={styles.container}>
            {/* Glow viền avatar */}
            <Animated.View
                style={[
                    styles.glow,
                    {
                        backgroundColor: glowColor,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            />
            {/* Avatar */}
            <Image source={{ uri }} style={styles.avatar} />

            {/* Đàn dơi bay */}
            {Array.from({ length: NUM_BATS }).map((_, index) => (
                <FlyingBat key={index} delay={index * 300} />
            ))}

            {/* Biểu tượng bí ngô phát sáng */}
            <Animated.View style={[styles.pumpkin, { opacity: pumpkinGlowAnim }]}>
                <Animated.View style={{ color: pumpkinColor }}>
                    <MaterialCommunityIcons name="pumpkin" size={40} />
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 220,
        height: 240,
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        zIndex: 0,
        opacity: 0.65,
        shadowColor: '#ff6600',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 30,
        elevation: 25,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#fff',
        zIndex: 1,
    },
    pumpkin: {
        position: 'absolute',
        bottom: 8,
        right: 10,
    },
});

export default GlowAvatar;
