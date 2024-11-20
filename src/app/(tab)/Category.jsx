import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
// import { members, subCategory } from '../../data';
import { CreateSubCategoryApi, GetParentCategoryApi, GetSubCategoryApi } from '../../api/categoryapi';
import { Picker } from '@react-native-picker/picker';
import Loading from '../components/loading';

const { width, height } = Dimensions.get('window');

const Category = () => {
  const types = ['gold', 'silver', 'diamond'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [parent, setParent] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pname , setPname]  = useState('Gold');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [newInvoice, setNewInvoice] = useState({
    name: '',
    pcategory: ''
  });

  // Fetch parent categories
  useEffect(() => {
    GetParentCategoryApi((loading, res) => {
      setIsLoading(loading);
      if (res?.success) {
        setParent(res?.data);
        setSelectedParentId(res?.data[0]?._id); // Default to the first parent
      }
    });
  }, []);
  // Fetch subcategories when active parent changes
  useEffect(() => {
    if (parent.length > 0) {
      const activeParentId = parent[activeIndex]?._id;
      if (activeParentId) {
        GetSubCategoryApi((loading, res) => {
          setIsLoading(loading)
          if (res?.success) {
            // console.log("res of sub category ", res?.data)
            setSubCategories(res?.data);
          }
        }, activeParentId);
      }
    }
  }, [activeIndex, parent]);


  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.box,
        index === activeIndex && styles.activeBox
      ]}
      key={index}
      onPress={() => {
        setActiveIndex(index),
        setPname(item?.name)
      }
      }
    >
      <Text style={[
        styles.name,
        index === activeIndex && styles.activeName
      ]}>
        {item?.name}
      </Text>
      <View style={[
        styles.drawerIconView,
        index === activeIndex && styles.activeDrawerIconView
      ]}>
        {item?.name === 'Gold' && (
          <Image
            source={require("../../assets/Images/gold.png")}
            style={[
              styles.drawerIcon,
              index === activeIndex && styles.activeDrawerIcon
            ]}
          />
        )}
        {item?.name === 'Silver' && (
          <Image
            source={require("../../assets/Images/silver.jpg")}
            style={[
              styles.drawerIcon,
              index === activeIndex && styles.activeDrawerIcon
            ]}
          />
        )}
        {item?.name === 'Diamond' && (
          <Image
            source={require("../../assets/Images/diamond.jpg")}
            style={[
              styles.drawerIcon,
              index === activeIndex && styles.activeDrawerIcon
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  // Render subcategories for the selected parent
  const renderSubCategory = ({ item }) => (
    <View style={styles.boxcontainer}>
      <View style={[styles.box1,{ flexDirection: 'row', alignItems: 'center', width: width * .2,}]}>
        {
          pname == 'Gold' ?
          <Image style={{ width: width * .025, height: width * .025, borderRadius: 50, marginRight: width * .005 }}
          source={require('../../assets/Images/gold.png')}
        /> :
        pname == 'Silver' ?
        <Image style={{ width: width * .025, height: width * .025, borderRadius: 50, backgroundColor: 'blue', marginRight: width * .005 }}
          source={require('../../assets/Images/silver.jpg')}
        /> :
        <Image style={{ width: width * .025, height: width * .025, borderRadius: 50, backgroundColor: 'blue', marginRight: width * .005 }}
          source={require('../../assets/Images/diamond.jpg')}
        />
        }
        <View>
          <Text style={{ fontWeight: '600' }}>{item?.name}</Text>
        </View>
      </View>
      <Text style={styles.box1}>{item?.pcategory?.name}</Text>
      {/* <Text style={[styles.box1, { textAlign: 'left' }]}>{item?.itemcode || 'NA'}</Text> */}
      {/* <Text style={[styles.box1, { textAlign: 'left' }]}>{item?.price || 'NaN'}</Text> */}
      <Text style={styles.box1}>{item?.available || 'Available'}</Text>
    </View>
  );

  // Handle creating subcategory
  const handleCreateSubCategory = () => {
    if (!newInvoice.name || !selectedParentId) {
      console.log("Please provide both name and parent category");
      return;
    }

    const postData = {
      name: newInvoice.name,
      pcategory: selectedParentId
    };

    CreateSubCategoryApi((loading) => {
      if (!loading) {
        setModalVisible(false);
        resetForm(); // Reset the form after successful creation
      }
    }, postData);
  };

  // Reset form after creating subcategory
  const resetForm = () => {
    setNewInvoice({ name: '', pcategory: '' });
    setSelectedParentId(parent[0]?._id); // Reset to the first parent category
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        
        <View>
            <Text style={styles.headerText}>Pages / Category</Text>
            <Text style={styles.headerTitle}>Category</Text>
          </View>
          <View style={styles.addview}>
            <TouchableOpacity style={styles.newCategoryButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="create" size={15} color="black" />
              <Text style={styles.headerText}>Add Category</Text>
            </TouchableOpacity>
          </View>
      </View>

      {isLoading ? (
        // <View style={{ position: 'absolute', top: height * .45, left: width * .3 }}>
        //   <Text style={styles.ScreenName}>Fetching Data, Please wait ....</Text>
        //   <ActivityIndicator size="large" color="#0000ff" />
        // </View>
        <Loading/>
      ) : (
        <>

         
          <View style={styles.card}>
            <FlatList
              data={parent}
              renderItem={renderItem}
              keyExtractor={(index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: height * .01 ,gap:width*.002}}> */}
          <View style={styles.boxcontainer}>
            <Text style={[styles.box1]}>Product name</Text>
            <Text style={[styles.box1]}>Category</Text>
            {/* <Text style={[styles.box1]}>Item code</Text> */}
            {/* <Text style={[styles.box1]}>Price</Text> */}
            <Text style={[styles.box1]}>Availablity</Text>
          </View>

          <View style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>

            <FlatList
              data={subCategories}
              renderItem={renderSubCategory}
              keyExtractor={(index) => index.toString()}
              // showsVerticalScrollIndicator={false}
              ListEmptyComponent={(
                <Text style={[styles.box1, { position: 'absolute', top: height * .4, left: width * .25 }]}>NO DATA FOUND ..</Text>
              )}
            />
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              resetForm();
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Create Category</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Category Name"
                  value={newInvoice.name}
                  onChangeText={(text) => setNewInvoice({ ...newInvoice, name: text })}
                />

                <View style={styles.pickerContainer}>
                  <Text>Select Parent Category:</Text>
                  <Picker
                    selectedValue={selectedParentId}
                    onValueChange={(itemValue) => setSelectedParentId(itemValue)}
                    style={styles.picker}
                  >
                    {parent.map((category) => (
                      <Picker.Item key={category._id} label={category.name} value={category._id} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.button} onPress={() => {
                    setNewInvoice('')
                    setSelectedParentId('')
                    setModalVisible(false)
                    }}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreateSubCategory}>
                    <Text style={styles.buttonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F0FFFF'
  },
  TextContainer: {
    flexDirection: "row",
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
  // page: {
  //   color: "#A0AEC0",
  // },
  ScreenName: {
    fontSize: width * 0.011,
    fontWeight: '500',
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
  newCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * .1,
      textAlign:'right'

  },
  card: {
    marginTop: height * .01,
    // borderTopWidth: .5,
    // paddingTop: height * .03,
    // borderColor: 'gray'
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  box: {
    width: width * 0.18,
    height: height * 0.12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingHorizontal: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: width * 0.12
  },
  activeBox: {
    backgroundColor: "#4FD1C5",
  },
  name: {
    color: '#000',
    fontWeight: '600',
    fontSize: width * 0.015,
  },
  activeName: {
    color: '#fff',
  },
  drawerIconView: {
    backgroundColor: "#4FD1C5",
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeDrawerIconView: {
    backgroundColor: "#fff",
  },
  drawerIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,

  },
  // activeDrawerIcon: {
  //   tintColor: "#4FD1C5",
  // },
  scrollView: {
    height: height * .65
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  boxcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    width: width * .79, 
    height: height * .1,
    borderTopWidth: .5,
    elevation: 10,
    // backgroundColor: '#F8F9FA',
    // backgroundColor:'blue',
    marginTop: 5,
    // paddingHorizontal: width * .008,
  },
  box1: {
    width: width * .2,
    textAlign: 'center',
    fontWeight: '500',
    // paddingLeft: width * .005,
    marginRight: width * .001,
  },

  // modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    // borderRadius: 25 ,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    flex: 1,
    marginHorizontal: 5,
  },
  createButton: {
    backgroundColor: "#4fd1c5",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  pickerContainer: {
    // borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  picker: {
    height: 40,
    width: '100%',
  },
});

export default Category;