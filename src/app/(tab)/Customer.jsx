import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { members } from "../../data";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import {
  GetAllCustomerApi,
  GetCreateCustomerApi,
  UpdateCustomerApi,
} from "../../api/customer";
import Toasty from "../components/modal";
import Loading from "../components/loading";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Customer({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [searchloading, setSearchLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchName, setSearchName] = useState("");

  // GET ALL CUSTOMERS
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllCustomerApi(setErrorToast, setToastMessage);
      if (result.status === "success") {
        setCustomers(result.data);
      } else if (result.status === "info") {
        setErrorToast(true);
        setToastMessage("No customers found");
        setTimeout(() => setErrorToast(false), 2000);
      } else {
        setErrorToast(true);
        setToastMessage("Failed to fetch customers");
        setTimeout(() => setErrorToast(false), 2000);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const [nameData, setnameData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    phoneNumber: "",
    add: "",
    contactWith: "",
  });

  const handleCreateCustomer = async () => {
    // Check if all fields are empty
    if (
      !nameData.name ||
      !nameData.email ||
      !nameData.mobileNumber ||
      !nameData.phoneNumber ||
      !nameData.add ||
      !nameData.contactWith
    ) {
      setErrorToast(true);
      setToastMessage("All Fields are required!");
      setTimeout(() => setErrorToast(false), 2000);
      return; // Stop further execution if validation fails
    }

    // Validate email format
    if (!validateEmail(nameData.email)) {
      setErrorToast(true);
      setToastMessage("Invalid email address");
      setTimeout(() => setErrorToast(false), 2000);
      return; // Stop further execution if validation fails
    }

    // Validate mobile number and phone number format
    if (
      !validatePhoneNumber(nameData.mobileNumber) ||
      !validatePhoneNumber(nameData.phoneNumber)
    ) {
      setErrorToast(true);
      setToastMessage("Invalid phone number");
      setTimeout(() => setErrorToast(false), 2000);
      return; // Stop further execution if validation fails
    }

    try {
      // Create new customer data
      const response = await GetCreateCustomerApi(nameData);
      if (response.status === "success") {
        setShowToast(true);
        setToastMessage("New Customer Created Successfully.");
        setTimeout(() => setShowToast(false), 2000);
        fetchCustomers(); // Fetch customers again to update the list
      } else {
        setErrorToast(true);
        setToastMessage("Failed to create customer");
        setTimeout(() => setErrorToast(false), 2000);
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
      setErrorToast(true);
      setToastMessage("An unexpected error occurred");
      setTimeout(() => setErrorToast(false), 2000);
    } finally {
      // Reset the modal and form data
      setModalVisible(false);
      setnameData({
        name: "",
        email: "",
        mobileNumber: "",
        phoneNumber: "",
        add: "",
        contactWith: "",
      });
    }
  };

  // edit the customer  details
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingCustomerData, setEditingCustomerData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    phoneNumber: "",
    add: "",
    contactWith: "",
  });

  // Function to handle editing a customer
  const handleEditCustomer = async () => {
    if (
      !editingCustomerData.name ||
      !editingCustomerData.email ||
      !editingCustomerData.mobileNumber ||
      !editingCustomerData.phoneNumber ||
      !editingCustomerData.add ||
      !editingCustomerData.contactWith
    ) {
      setErrorToast(true);
      setToastMessage("All Fields are required !");
      setTimeout(() => setErrorToast(false), 2000);
      return;
    }

    if (!validateEmail(editingCustomerData.email)) {
      setErrorToast(true);
      setToastMessage("Invalid email address");
      setTimeout(() => setErrorToast(false), 2000);
      return;
    }

    if (
      !validatePhoneNumber(editingCustomerData.mobileNumber) ||
      !validatePhoneNumber(editingCustomerData.phoneNumber)
    ) {
      setErrorToast(true);
      setToastMessage("Invalid phone number");
      setTimeout(() => setErrorToast(false), 2000);
      return;
    }

    try {
      const response = await UpdateCustomerApi(
        editingCustomerId,
        editingCustomerData
      );
      if (response.status === "success") {
        setShowToast(true);
        setToastMessage("Customer Updated Successfully..");
        setTimeout(() => setShowToast(false), 2000);
        fetchCustomers();
      } else if (response.status === "info") {
        setErrorToast(true);
        setToastMessage("Failed to update customer");
        setTimeout(() => setErrorToast(false), 2000);
      } else {
        setErrorToast(true);
        setToastMessage("An unexpected error occurred");
        setTimeout(() => setErrorToast(false), 2000);
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      setErrorToast(true);
      setToastMessage("An unexpected error occurred");
      setTimeout(() => setErrorToast(false), 2000);
    } finally {
      setModalVisible(false);
      setEditingCustomerId(null);
      setEditingCustomerData({
        name: "",
        email: "",
        mobileNumber: "",
        phoneNumber: "",
        add: "",
        contactWith: "",
      });
    }
  };

  // Function to handle editing a customer when the edit button is clicked
  const handleEditCustomerClick = (customer) => {
    // console.log("customer data ", customer?._id);
    setModalVisible(true);
    setEditingCustomerId(customer?._id);

    setEditingCustomerData({
      name: customer.name,
      email: customer.email,
      mobileNumber: customer.mobileNumber,
      phoneNumber: customer.phoneNumber,
      add: customer.add,
      contactWith: customer.contactWith,
    });
  };

  // search user
  const handleSearch = async (searchTerm) => {
    try {
      setSearchLoading(true);
      const response = await GetAllCustomerApi("", "", searchTerm);
      setSearchLoading(false);
      // console.log(response, "response1");
      if (response.status == "success") {
        setCustomers(response.data);
      } else {
        console.error("Error fetching customers:", response.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching customers:", error);
    }
  };
  const handleSearch1 = async (searchTerm) => {
    try {
      setSearchLoading(true);
      const response = await GetAllCustomerApi("", "", searchTerm);
      setSearchLoading(false);
      // console.log(response, "response1");
      if (response.status == "success") {
        setCustomer(response.data);
      } else {
        console.error("Error fetching customers:", response.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching customers:", error);
    }
  };
  const handleCustomerSelect = (customer) => {
    // console.log("setCustomerName", customer);
    setEditingCustomerData({
      ...editingCustomerData,
      contactWith: customer._id,
    });
    setnameData({ ...nameData, contactWith: customer._id });
    setCustomerName(customer.name);
    setCustomer([]);
  };

  return (
    <View style={styles.container}>
      {showToast && <Toasty type="success" message={toastMessage} />}
      {errorToast && <Toasty type="error" message={toastMessage} />}
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Pages / Customer</Text>
            <Text style={styles.headerTitle}>Customer</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <TouchableOpacity>
              <AntDesign name="bells" size={14} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.innnerContainer}>
          <View style={styles.Customerinfo}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Customer Information</Text>
              <TouchableOpacity
                style={styles.createUserButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="create" size={15} color="black" />
                <Text style={styles.headerText}>Create Customer</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", marginBottom: height * 0.01 }}>
              <Text style={styles.box}>Customer Name</Text>
              <Text style={styles.box}>Mobile No.</Text>
              <Text style={styles.box}>Alternate Mobile No.</Text>
              <Text style={styles.box}>Address</Text>
            </View>
            <View
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
            >
              {isLoading ? (
                // <View style={{ position: 'absolute', top: height * .35, left: width * .3 }}>
                //     <Text style={styles.ScreenName}>Fetching Customer Data, Please wait ....</Text>
                //     <ActivityIndicator size="large" color="#0000ff" />
                // </View>
                <Loading />
              ) : (
                <FlatList
                  data={customers}
                  renderItem={({ item }) => (
                    <View style={styles.boxcontainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: width * 0.17,
                        }}
                      >
                        <Image
                          style={{
                            width: width * 0.025,
                            height: width * 0.025,
                            borderRadius: 50,
                            marginRight: width * 0.005,
                          }}
                          source={require("../../assets/Images/user.png")}
                        />
                        <View>
                          <Text style={{ fontWeight: 600 }}>
                            {item?.name || "Unknown"}
                          </Text>
                          <Text
                            style={{
                              width: width * 0.1,
                              fontSize: width * 0.008,
                            }}
                          >
                            {item?.email || "NA"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.box}>
                        {item?.mobileNumber || "NA"}
                      </Text>
                      <Text style={styles.box}>
                        {item?.phoneNumber || "NA"}
                      </Text>
                      <Text style={styles.box}>{item?.add || "NA"}</Text>
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
                  )}
                  keyExtractor={(item) => item.toString()}
                />
              )}
            </View>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm(); // Optionally reset the form on close
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingCustomerId ? "Edit Customer" : "Create Customer"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name..."
              value={
                editingCustomerId ? editingCustomerData.name : nameData.name
              }
              onChangeText={(text) => {
                if (editingCustomerId) {
                  setEditingCustomerData({
                    ...editingCustomerData,
                    name: text,
                  });
                } else {
                  setnameData({ ...nameData, name: text });
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter email..."
              value={
                editingCustomerId ? editingCustomerData.email : nameData.email
              }
              onChangeText={(text) => {
                if (editingCustomerId) {
                  setEditingCustomerData({
                    ...editingCustomerData,
                    email: text,
                  });
                } else {
                  setnameData({ ...nameData, email: text });
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number..."
              value={
                editingCustomerId
                  ? editingCustomerData.mobileNumber
                  : nameData.mobileNumber
              }
              onChangeText={(text) => {
                // Use a regular expression to allow only numbers
                const numericText = text.replace(/[^0-9]/g, "");

                // Limit the input to 10 digits
                if (numericText.length <= 10) {
                  if (editingCustomerId) {
                    setEditingCustomerData({
                      ...editingCustomerData,
                      mobileNumber: numericText,
                    });
                  } else {
                    setnameData({ ...nameData, mobileNumber: numericText });
                  }
                }
              }}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter alternate number..."
              value={
                editingCustomerId
                  ? editingCustomerData.phoneNumber
                  : nameData.phoneNumber
              }
              onChangeText={(text) => {
                // Use a regular expression to allow only numbers
                const numericText = text.replace(/[^0-9]/g, "");

                // Limit the input to 10 digits
                if (numericText.length <= 10) {
                  if (editingCustomerId) {
                    setEditingCustomerData({
                      ...editingCustomerData,
                      phoneNumber: numericText,
                    });
                  } else {
                    setnameData({ ...nameData, phoneNumber: numericText });
                  }
                }
              }}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter address..."
              value={editingCustomerId ? editingCustomerData.add : nameData.add}
              onChangeText={(text) => {
                if (editingCustomerId) {
                  setEditingCustomerData({ ...editingCustomerData, add: text });
                } else {
                  setnameData({ ...nameData, add: text });
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Referred by..."
              value={customerName}
              onChangeText={(text) => {
                setCustomerName(text);
                handleSearch1(text);
              }}
            />
            {searchloading && <ActivityIndicator size="small" />}
            {customer.length > 0 && (
              <View style={styles.searchlist}>
                <FlatList
                  data={customer}
                  keyExtractor={(item) => item._id.toString()} // Ensure using a unique key
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleCustomerSelect(item)}
                    >
                      <View style={styles.customerItem}>
                        <Text>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setCustomer([]);
                  setCustomerName("");
                  setEditingCustomerData({});
                  setnameData({});
                  setModalVisible(false);
                  resetForm(); // Optionally reset the form when canceling
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={
                  editingCustomerId ? handleEditCustomer : handleCreateCustomer
                }
              >
                <Text style={styles.buttonText}>
                  {editingCustomerId ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F0FFFF'
  },
  // content: {
  //   flexGrow: 1,
  //   padding: 10,
  // },
  // header: {
  //   // backgroundColor: '#40E0D0',
  //   paddingHorizontal: 20,
  //   paddingBottom: 20,
  //   padding: 5,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   borderTopRightRadius: 10,
  //   borderTopLeftRadius: 10,
  //   width: width * 0.79,
  // },
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
    color: 'white',
    fontSize: 14,
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
  box: {
    width: width * 0.18,
    textAlign: "left",
    fontWeight: 500,
    paddingLeft: width * 0.005,
    marginRight: width * 0.001,
  },

  profileCard: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
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
  TextContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  ScreenName: {
    fontSize: width * 0.011,
    fontWeight: "500",
  },
  page: {
    color: "#A0AEC0",
  },
  innnerContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 50,
  },
  customerItem: {
    textAlign: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 5,
  },
  searchlist: {
    height: height * 0.08,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 10,
  },
  Customerinfo: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginRight: 10,
    height: height * 0.9,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "black",
    fontWeight: "500",
  },
  createUserButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
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
    // elevation: 10,
    // backgroundColor: "#F8F9FA",
    paddingHorizontal: width * 0.008,
  },
  invoice: {
    backgroundColor: "white",
    flex: 1,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    height: height * 0.9,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  viewAllButton: {
    borderWidth: 2,
    padding: 8,
    borderRadius: 10,
    borderColor: "#4fd1c5",
  },
  viewAllText: {
    fontWeight: "500",
    color: "#4fd1c5",
    fontSize: width * 0.008,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
  },
  picker: {
    height: 40,
    width: "100%",
  },
});
