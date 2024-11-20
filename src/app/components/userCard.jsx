import { View, Text, Dimensions, TouchableOpacity, Linking, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GenerateInvoiceApi } from '../../api/billingApi';
import * as FileSystem from 'expo-file-system';  // Import expo-file-system
import * as Print from 'expo-print';  // Import expo-print

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const UserCard = ({ name, company, email, vat, products, invoiceId }) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    setLoading(true);
    GenerateInvoiceApi(async (loading, res) => {
      setLoading(loading);
      if (res?.success) {
        const pdfUrl = res.data;

        if (Platform.OS === 'web') {
          // Open PDF in new tab for web
          window.open(pdfUrl, '_blank');
        } else {
          // For native, download the PDF using expo-file-system
          const downloadResumable = FileSystem.createDownloadResumable(
            pdfUrl,
            FileSystem.documentDirectory + `invoice_${invoiceId}.pdf`
          );

          try {
            const { uri } = await downloadResumable.downloadAsync();
            alert('Invoice downloaded to: ' + uri);
          } catch (e) {
            console.error(e);
            alert('Failed to download invoice.');
          }
        }
      }
    }, invoiceId);
  };

  const handlePrintInvoice = async () => {
    setLoading(true);
    GenerateInvoiceApi(async (loading, res) => {
      setLoading(loading);
      if (res?.success) {
        const pdfUrl = res.data;

        if (Platform.OS === 'web') {
          // Open the PDF in new tab and trigger print for web
          const newWindow = window.open(pdfUrl, '_blank');
          if (newWindow) {
            newWindow.focus();
            newWindow.print();  // Print from the new window
          }
        } else {
          // Use expo-print for native platforms
          try {
            await Print.printAsync({ uri: pdfUrl });
          } catch (e) {
            console.error(e);
            alert('Failed to print invoice.');
          }
        }
      }
    }, invoiceId);
  };

  return (
    <View style={{ backgroundColor: '#f8f9fa', width: width * 0.7, alignSelf: 'center', borderRadius: 10, padding: 10, marginBottom: height * 0.015, elevation: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: width * 0.01, fontWeight: '600' }}>
          {name}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
          {loading ? (
            <ActivityIndicator size="small" style={{ width: 100, alignSelf: 'flex-start' }} />
          ) : (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }} onPress={handleDownloadInvoice}>
              <AntDesign name="download" size={14} color="black" />
              <Text style={{ color: 'green', fontSize: width * 0.01, fontWeight: '600' }}>Download Invoice</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }} onPress={handlePrintInvoice}>
            <AntDesign name="printer" size={14} color="black" />
            <Text style={{ color: 'gray', fontSize: width * 0.01, fontWeight: '600' }}>Print</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ fontSize: width * 0.008 }}>Company Name: <Text style={{ fontWeight: '500' }}>{company}</Text></Text>
      <Text style={{ fontSize: width * 0.008 }}>Email Address: <Text style={{ fontWeight: '500' }}>{email}</Text></Text>
      <Text style={{ fontSize: width * 0.008 }}>Products Name: <Text style={{ fontWeight: '500' }}>{products}</Text></Text>
      <Text style={{ fontSize: width * 0.008 }}>Bill Number: <Text style={{ fontWeight: '500' }}>{vat}</Text></Text>
    </View>
  );
};

export default UserCard;
