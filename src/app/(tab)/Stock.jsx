
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import Loading from '../components/loading';
import { GetParentStockApi, GetSubStockApi, UpdateStockApi } from '../../api/stockapi';

const { width, height } = Dimensions.get('window');


const Stocks = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [parent, setParent] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pname, setPname] = useState('Gold');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [modalVisible, setModalVisible] = useState(false)

  const [selectedItem, setSelectedItem] = useState(null);
  const [newWeight, setNewWeight] = useState('');

  const [searchName, setSearchName] = useState('')


  const handleEditCustomerClick = (item) => {
    setSelectedItem(item);
    setNewWeight(item.weight.toString()); // prefill weight in the modal
    setModalVisible(true);
  };

  // Fetch parent categories
  useEffect(() => {
    GetParentStockApi((loading, res) => {
      setIsLoading(loading);
      if (res?.success) {
        setParent(res?.data);
        setSelectedParentId(res?.data[0]?.category?._id);
      }
    });
  }, []);
  useEffect(() => {
    if (parent.length > 0) {
      const activeParentId = parent[activeIndex]?.category?._id;
      if (activeParentId) {
        GetSubStockApi((loading, res) => {
          setIsLoading(loading)
          if (res?.success) {
            console.log("res of sub category ", res?.data)
            setSubCategories(res?.data);
          }
        }, activeParentId);
      }
    }
  }, [activeIndex, parent]);

  const handleUpdate = async () => {
    console.log("Updating stock", selectedItem, newWeight);

    if (selectedItem && newWeight) {
      const postdata = { weight: newWeight };
      const response = await UpdateStockApi(selectedItem?._id, postdata);

      if (response.status === 'success') {
        GetParentStockApi((loading, res) => {
          setIsLoading(loading);
          if (res?.success) {
            setParent(res?.data);
          }
        });

        GetSubStockApi((loading, res) => {
          setIsLoading(loading);
          if (res?.success) {
            setSubCategories(res?.data);
          }
        }, selectedItem?.category?._id);

        setModalVisible(false);
      } else {
        console.error("Failed to update stock");
      }
    }
  };



  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.box,
        index === activeIndex && styles.activeBox
      ]}
      key={index}
      onPress={() => {
        setActiveIndex(index),
          setPname(item?.category?.name)
      }
      }
    >
      <View>
        <Text style={[
          styles.name,
          index === activeIndex && styles.activeName
        ]}>
          {item?.category?.name}
        </Text>
        {/* {index === activeIndex && ( */}
        <Text style={styles.headerText}>Total Weight :  {item?.weight}</Text>
        {/* )} */}
      </View>
      <View style={[
        styles.drawerIconView,
        index === activeIndex && styles.activeDrawerIconView
      ]}>
        {item?.category?.name === 'Gold' && (
          <Image
            source={require("../../assets/Images/gold.png")}
            style={[
              styles.drawerIcon,
              index === activeIndex && styles.activeDrawerIcon
            ]}
          />
        )}
        {item?.category?.name === 'Silver' && (
          <Image
            source={require("../../assets/Images/silver.jpg")}
            style={[
              styles.drawerIcon,
              index === activeIndex && styles.activeDrawerIcon
            ]}
          />
        )}
        {item?.category?.name === 'Diamond' && (
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
      <View style={[styles.box1, { flexDirection: 'row', alignItems: 'center', width: width * .2, }]}>
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
          <Text style={{ fontWeight: '600' }}>{item?.category?.name}</Text>
        </View>
      </View>
      {/* <Text style={styles.box1}>{item?.pcategory?.name}</Text> */}
      {/* <Text style={[styles.box1, { textAlign: 'left' }]}>{item?.itemcode || 'NA'}</Text> */}
      <Text style={styles.box1}>{item?.weight || 0}</Text>
      <TouchableOpacity
        onPress={() => handleEditCustomerClick(item)}
      >
        <Text
          style={{
            fontWeight: 600,
            backgroundColor: "lightgray",
            paddingHorizontal: width * 0.01,
            borderRadius: 20,
          }}
        >
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );



  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.TextContainer}>
        <Text style={styles.page}>Pages/ </Text>
        <Text style={styles.ScreenName}>Stocks</Text>
      </View> */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Pages / Stocks</Text>
          <Text style={styles.headerTitle}>Stocks</Text>
        </View>
        {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 0.5,
                borderRadius: 20,
                marginRight: 20,
                padding: width * 0.005,
              }}
            >
              <TextInput
                placeholder="Enter username..."
                style={styles.inputsearch}
                onChangeText={(name) => setSearchName(name)}
                value={searchName}
              />
              <TouchableOpacity onPress={() => handleSearch(searchName)}>
                <AntDesign name="search1" size={width * 0.01} />
              </TouchableOpacity>
            </View>
          </View> */}
      </View>
      {isLoading ? (
        <Loading />
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * .01, width: width * .58 }}>
            <Text style={[styles.box1]}>Product name</Text>
            <Text style={[styles.box1]}>Availablity</Text>
            {/* <Text style={[styles.box1]}></Text> */}

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
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Edit Weight</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Weight"
                  keyboardType="numeric"
                  value={newWeight}
                  onChangeText={setNewWeight}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.button} onPress={() => {
                    setModalVisible(false),
                      setNewWeight("")
                  }
                  }>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
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
    backgroundColor: '#F0FFFF'
  },
  TextContainer: {
    flexDirection: "row",
  },
  page: {
    // color: "#A0AEC0",
  },
  ScreenName: {
    fontSize: width * 0.011,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#40E0D0',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
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
  inputsearch: {
    outlineStyle: "none",
    paddingHorizontal: 5,
  },
  newCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * .65,
    alignSelf: 'center',
    marginTop: height * .02,
  },
  card: {
    marginTop: height * .01,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
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
    height: height * .63
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  boxcontainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    height: height * 0.1,
    borderTopWidth: 0.5,
    justifyContent: 'space-between',
    // elevation: 10,
    // backgroundColor: "#F8F9FA",
    paddingHorizontal: width * 0.008,
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

export default Stocks;