import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedMain } from '@/components/ThemedMain';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity  } from 'react-native';
import { useRouter, Link } from 'expo-router';
import useWebSocket from '@/hooks/useWebSocket';
export default function HomeScreen() {
    const { isConnected, message, sendMessage, closeConnection, error, connect, isConnecting } = useWebSocket('ws://10.0.25.87:8765');
    const router = useRouter();


    // useEffect(() => {
    //   sendMessage(JSON.stringify({
    //     cmd: "device/online"
    //   }))
    // }, [])
    

    const handleNavigateToDetails = () => {
        router.push('/details');
    };
    
    return (
        <ThemedMain style={styles.mainBox}>
            <ThemedText style={styles.mainTitle}>优家庭</ThemedText>
            <ThemedView style={styles.gridBox}>
                <TouchableOpacity  style={styles.gridItemBox} onPress={handleNavigateToDetails}>
                    <Image style={styles.img} source={require('@/assets/images/t.png')} />
                    <ThemedText numberOfLines={1} ellipsizeMode="tail" style={styles.gridItemBoxP}>温湿度计</ThemedText>
                    <ThemedText numberOfLines={1} ellipsizeMode="tail" style={styles.gridItemBoxTips}>卧室</ThemedText>
                    {/* 右上角的圆形浮动元素 */}
                    <View style={styles.floatingCircle}>
                      <View style={styles.Circle}></View>
                      <Text style={styles.floatingText}>离线</Text>
                    </View>
                </TouchableOpacity >
                <ThemedView style={styles.gridItemBox}></ThemedView>
            </ThemedView>
            {/* <Text>{message}</Text> */}
        </ThemedMain>
    );
}

const styles = StyleSheet.create({
  mainBox: {
    paddingLeft: 20,
    paddingRight: 20,
    minHeight: '100%',
    backgroundColor: '#fafafa'
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    height: 40,
    lineHeight: 40
  },
  gridBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    marginTop: 10
  },
  gridItemBox: {
    width: '49%',
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12
  },
  img: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    borderRadius: 8
  },
  gridItemBoxP: {
    fontSize: 14,
    height: 28,
    lineHeight: 28,
    color: '#333',
  },
  gridItemBoxTips: {
    fontSize: 12,
    height: 12,
    lineHeight: 12,
    color: '#888',
  },
  floatingCircle: {
    position: 'absolute', // 绝对定位
    top: 10, // 距离顶部的距离
    right: 10, // 距离右侧的距离
    paddingTop: 2,
    paddingLeft: 4,
    paddingRight: 8,
    paddingBottom: 2,
    borderRadius: 4, // 圆形的半径
    backgroundColor: 'rgba(233, 233, 233, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Circle: {
    width: 8, 
    height: 8,
    borderRadius: 6, // 圆形的半径
    backgroundColor: '#cdcdcd', // 圆形的背景颜色
  },
  floatingText: {
    fontSize: 10,
    marginLeft: 8
  }
});
