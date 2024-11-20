import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const ToastModal = ({ type = 'info', message}) => {
 

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4CAF50', borderLeftColor: '#45a049' };
      case 'info':
        return { backgroundColor: '#2196F3', borderLeftColor: '#1E88E5' };
      case 'warning':
        return { backgroundColor: '#FFC107', borderLeftColor: '#FFA000' };
      case 'error':
        return { backgroundColor: '#F44336', borderLeftColor: '#D32F2F' };
      default:
        return { backgroundColor: '#2196F3', borderLeftColor: '#1E88E5' };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'info': return 'i';
      case 'warning': return '!';
      case 'error': return 'X';
      default: return 'i';
    }
  };

  return (
    <View style={[styles.container, getTypeStyles()]}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 2,
    left: width*.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding: width * 0.012,
    borderRadius: 4,
    borderLeftWidth: 4,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width:width*.15,
    height:height*.001,
    zIndex: 99,
  },
  icon: {
    color: 'white',
    fontSize: width * 0.012,
    fontWeight: 'bold',
    marginRight: width * 0.01,
  },
  message: {
    color: 'white',
    fontSize: width * 0.010,
    fontWeight:400
    // flex: 1,
  },
});

export default ToastModal;