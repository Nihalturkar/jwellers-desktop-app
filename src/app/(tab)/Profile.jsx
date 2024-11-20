import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Toasty from '../components/modal';
import { GetProfileApi } from '../../api/dashboard';
import Loading from '../components/loading';


export default function Profile() {

    const [switch1, setSwitchValue1] = useState(false);
    const [switch2, setSwitchValue2] = useState(false);
    const [switch3, setSwitchValue3] = useState(false);
    const [switch4, setSwitchValue4] = useState(false);
    const [switch5, setSwitchValue5] = useState(false);
    const [switch6, setSwitchValue6] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        GetProfileApi((data, res) => {
            setLoading(data)
            if (res?.success) {
                setProfileData(res?.data)
            }
        })
    }, [])

    const isElectron = () => {
        return typeof window !== 'undefined' && window.process && window.process.type;
      };
      


    const handleLogout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('@USER_TOKEN');
            console.log("Logout successful");
            setShowToast(true);
            setToastMessage('LogOut successfully');
            setTimeout(() => setShowToast(false), 2000);
            if (Platform.OS === 'web') {
                window.location.reload(); 
              } else if (isElectron()) {
                const { remote } = window.require('electron');
                remote.getCurrentWindow().reload(); 
              }
            navigation.navigate('LoginPage')
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
        }
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            {showToast && <Toasty type='success' message={toastMessage} />}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerText}>Pages / Profile</Text>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', backgroundColor: '#f8f9fa', padding: 5, borderRadius: 10 }}
                        onPress={() => handleLogout()}>
                        {/* <TouchableOpacity>
                                <AntDesign name="logout" size={14} />
                            </TouchableOpacity> */}
                        <Text style={[styles.profileName, { fontSize: 16 }]}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <AntDesign name="bells" size={14} />
                    </TouchableOpacity>
                </View>
            </View>
            {
                loading ?
                    (
                        <Loading />
                    ) : (
                        <>


                            <View style={styles.profileCard}>
                                <Image
                                    style={styles.profileImage}
                                    source={require('../../assets/Images/user.png')}
                                />
                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileName}>{profileData?.companyName}</Text>
                                    <Text style={styles.profileEmail}>{profileData?.email}</Text>
                                </View>
                            </View>

                            <View style={styles.contentContainer}>
                                <View style={styles.settingsContainer}>
                                    <Text style={styles.sectionTitle}>Platform Settings</Text>
                                    <View style={styles.settingGroup}>
                                        <Text style={styles.settingGroupTitle}>ACCOUNT</Text>
                                        <View style={styles.settingItem}>
                                            <Text>Email me when someone follows me</Text>
                                            <Switch value={switch1} onValueChange={(newValue) => setSwitchValue1(newValue)} />
                                        </View>
                                        <View style={styles.settingItem}>
                                            <Text>Email me when someone answers on my post</Text>
                                            <Switch value={switch2} onValueChange={(newValue) => setSwitchValue2(newValue)} />
                                        </View>
                                        <View style={styles.settingItem}>
                                            <Text>Email me when someone mentions me</Text>
                                            <Switch value={switch3} onValueChange={(newValue) => setSwitchValue3(newValue)} />
                                        </View>
                                    </View>
                                    <View style={styles.settingGroup}>
                                        <Text style={styles.settingGroupTitle}>APPLICATION</Text>
                                        <View style={styles.settingItem}>
                                            <Text>New launches and projects</Text>
                                            <Switch value={switch4} onValueChange={(newValue) => setSwitchValue4(newValue)} />
                                        </View>
                                        <View style={styles.settingItem}>
                                            <Text>Monthly product updates</Text>
                                            <Switch value={switch5} onValueChange={(newValue) => setSwitchValue5(newValue)} />
                                        </View>
                                        <View style={styles.settingItem}>
                                            <Text>Subscribe to newsletter</Text>
                                            <Switch value={switch6} onValueChange={(newValue) => setSwitchValue6(newValue)} />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.infoContainer}>
                                    <Text style={styles.sectionTitle}>Company Information</Text>
                                    <Text style={styles.infoText}>
                                        {profileData?.tc}
                                    </Text>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Owner Name:</Text>
                                        <Text style={styles.infoValue}>{profileData?.ownerName?.[0]}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Mobile No. :</Text>
                                        <Text style={styles.infoValue}>{profileData?.mobileNumber?.[0]}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>GST Number: </Text>
                                        <Text style={styles.infoValue}>{profileData?.gstNumber}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Location:</Text>
                                        <Text style={styles.infoValue}>{profileData?.city},{profileData?.pincode},{profileData?.state}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Social Media:</Text>
                                        <View style={styles.socialIcons}>
                                            <TouchableOpacity>
                                                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Ionicons name="logo-instagram" size={24} color="#E1306C" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    )
            }

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFFF',
    },
    header: {
        backgroundColor: '#40E0D0',
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopRightRadius:10,
        borderTopLeftRadius:10
    },
    headerText: {
        color: 'black',
        fontWeight: '500',
      },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    profileCard: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        elevation: 3,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileInfo: {
        marginLeft: 20,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        color: 'gray',
    },
    contentContainer: {
        flexDirection: 'row',
        padding: 20,
    },
    settingsContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingGroup: {
        marginBottom: 20,
    },
    settingGroupTitle: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoLabel: {
        fontWeight: 'bold',
        width: 100,
    },
    infoValue: {
        flex: 1,
    },
    socialIcons: {
        flexDirection: 'row',
    },
});