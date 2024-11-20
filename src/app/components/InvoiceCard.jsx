import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const InvoiceCard = ({name,code,price}) => {
  return (
    <View style={{ width: width * .35, alignSelf: 'center', borderRadius: 10, padding: 10, marginTop: height * .01 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: width * .01, fontWeight: 600 }}>
            {name}
          </Text>
          <Text style={{ fontSize: width * .008 }}>{code}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20,alignItems:'center' }}>
          <Text style={{ color: 'green', fontSize: width * .008 }}>{price}</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <AntDesign name="pdffile1" size={14} color="black" />
            <Text style={{ color: 'gray', fontSize: width * .008 }}>Pdf</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

export default InvoiceCard

// const styles = StyleSheet.create({})