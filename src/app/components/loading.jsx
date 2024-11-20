import { View, Text, Image } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Loading = () => {
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
     <Image   source={require("../../assets/Images/loading.gif")} style={{ width:width*.4,height:height*.25}} resizeMode='contain'/>
    </View>
  )
}

export default Loading