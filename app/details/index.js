import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedMain } from '@/components/ThemedMain';
import { useRouter, Link } from 'expo-router';
import useWebSocket from '@/hooks/useWebSocket';

export default function DetailsScreen() {
    const router = useRouter();

    const { isConnected, message, sendMessage, closeConnection, error, connect, isConnecting, lastMessage } = useWebSocket();

    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    
    const [updateTime, setUpdateTime] = useState(null);
    const [isOnline, setIsOnline] = React.useState(false);

    useEffect(() => {
      if (message) {
        try {
          let msg = JSON.parse(message)
          
          if(msg.cmd === "temp/hum") {
            setTemperature(msg.data.device_temp);
            setHumidity(msg.data.device_humidity);
            setUpdateTime(msg.data.device_update_time)
            setIsOnline(msg.data.online == 1)
          }
        }catch(e) {

        }
        
      }
    }, [message, lastMessage]);

    

    const gotoBack = () => {
        router.back();
    }
  return (
    <ThemedMain style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={gotoBack}>
                <Image style={styles.headerLeft} source={require('@/assets/images/left.png')} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>温湿度计</Text>
            <TouchableOpacity >
               
            </TouchableOpacity>
        </View>
        <View style={styles.infoBox}>
            <View style={styles.infoBoxTitle}>
                <Text style={styles.text}>温湿度计信息</Text>
                {
                    isOnline ? <Text style={[styles.text, styles.online]}>在线</Text> : <Text style={[styles.text, styles.offline]}>离线</Text>
                }
            </View>
            
            <View style={styles.box}>
                <View style={styles.boxItem}>
                    <Text style={styles.sum}>{temperature}°</Text>
                    <Text style={styles.tips}>温度</Text>
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.sum}>{humidity}%</Text>
                    <Text style={styles.tips}>湿度</Text>
                </View>
            </View>
        </View>
        <Text style={styles.date}>数据上报时间：{updateTime}</Text>
        {/* {fullMessage && <Text>Full Message: {JSON.stringify(fullMessage)}</Text>} */}
    </ThemedMain>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingLeft:15,
    paddingRight:15,
  },
  header: {
    height: 50,
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  headerLeft: {
    width: 26,
    height: 26,
  },
  headerTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  sum: {
    fontSize: 30,
    
  },
  tips: {
    fontSize: 14,
    color: '323232'
  },
  date: {
    fontSize: 10,
    color: '#888',
    marginTop: 10,
    paddingLeft: 2
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  boxItem: {
    flex: 1,
    alignItems: 'left',
    borderColor: '#ccc',
  },
  infoBox: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    borderRadius: 10,

  },
  infoBoxTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 1,
  },
  offline: {
    color: '#888',
    fontSize: 12,
  },
  online: {
    color: '#67C23A',
    fontSize: 12,
  }
});