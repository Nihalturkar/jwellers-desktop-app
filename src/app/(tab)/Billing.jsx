import React, { useCallback, useEffect, useState } from "react";
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
  ActivityIndicator,
  Switch,
} from "react-native";
import UserCard from "../components/userCard";
import { invoice, members } from "../../data";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import {
  CreateInvoiceApi,
  GetBillingApi,
  GetProductApi,
} from "../../api/billingApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAllCustomerApi } from "../../api/customer";
import Loading from "../components/loading";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Billing() {
  const [modalVisible, setModalVisible] = useState(false);
  const [invoice, setInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [searchloading, setSearchLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchProduct, setSearchProduct] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  // const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [invoiceData, setInvoiceData] = useState({
    customerId: "",
    companyId: "",
    product: [
      {
        productName: "",
        weight: "",
        gWeight: "",
        mark: "HUID",
        markingChargePercent: "",
        karat: "22",
        goldRate: "",
      },
    ],
    hmAmount: Number(""),
    gstTransport: false,
  });

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const company_id = await AsyncStorage.getItem("@COMPANY_ID");
        const company_name = await AsyncStorage.getItem("@COMPANY_NAME");
        setCompanyName(company_name);
        if (company_id !== null) {
          setInvoiceData((prevData) => ({
            ...prevData,
            companyId: company_id,
          }));
        }
      } catch (error) {
        console.error("Error retrieving company_id:", error);
      }
    };

    fetchCompanyId();
  }, []);

  useEffect(() => {
    GetBillingApi((loading, res) => {
      setIsLoading(loading);
      if (res?.success) {
        setInvoice(res?.data);
      }
    });
  }, []);

  const handleSearch = async (searchTerm) => {
    setSearchLoading(true);
    try {
      const response = await GetAllCustomerApi("", "", searchTerm);
      setSearchLoading(false);
      if (response.status === "success") {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("An error occurred while fetching customers:", error);
      setCustomers([]);
      setSearchLoading(false);
    }
  };

  const handleSearchProduct = async (searchTerm) => {
    setSearchLoading(true);
    GetProductApi((loading, res) => {
      setSearchLoading(loading);
      if (res?.data) {
        setSearchProduct(res.data);
      }
    }, searchTerm);
  };

  const resetForm = () => {
    setInvoiceData({
      customerId: "",
      companyId: invoiceData?.companyId,
      product: [
        {
          productName: "",
          weight: "",
          gWeight: "",
          mark: "HUID",
          markingChargePercent: "",
          karat: "22",
          goldRate: "",
        },
      ],
      hmAmount: Number(""),
      gstTransport: false,
    });
    setCustomerName("");
    setCustomers([]);
    setSearchProduct([]);
    setCurrentProductIndex(0);
  };

  const handleCustomerSelect = (customer) => {
    setInvoiceData({ ...invoiceData, customerId: customer._id });
    setCustomerName(customer.name);
    setCustomers([]);
  };

  const handleCreateInvoice = useCallback(() => {
    CreateInvoiceApi((loading, res) => {
      if (res?.success) {
        setModalVisible(false);
        setInvoice(res?.data);
        // GetBillingApi(loading); // Refresh the billing data
        GetBillingApi((loading, res) => {
          setIsLoading(loading);
          if (res?.success) {
            setInvoice(res?.data);
          }
        });
      } else {
        console.error("Error creating invoice:", res.message);
      }
    }, invoiceData);
  }, [invoiceData]);

  // const handleProductChange = (index, field, value) => {
  //   const updatedProducts = [...invoiceData.product];
  //   updatedProducts[index][field] = value;
  //   setInvoiceData({ ...invoiceData, product: updatedProducts });
  // };
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...invoiceData?.product];
    updatedProducts[index][field] = value;
    setInvoiceData({ ...invoiceData, product: updatedProducts });

    // If the field being changed is productName, reset the search results
    if (field === "productName") {
      setSearchProduct([]); // Clear the search results
    }
  };

  const handleProductSelect = (index, item) => {
    handleProductChange(index, "productName", item.name); // Set the selected product name
    setSearchProduct([]); // Clear the search results
  };
  const addProduct = () => {
    const newProduct = {
      productName: "",
      weight: "",
      gWeight: "",
      mark: "HUID",
      markingChargePercent: "",
      karat: "22",
      goldRate: "",
    };
    setInvoiceData({
      ...invoiceData,
      product: [...invoiceData?.product, newProduct],
    });
    setCurrentProductIndex(currentProductIndex + 1);
  };

  const handleBackProduct = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1);
    }
  };

  const isProductArrayFilled = () => {
    const currentProduct = invoiceData?.product[currentProductIndex];
    // Check if all required fields in the current product are filled
    return (
      currentProduct.productName &&
      currentProduct.weight &&
      currentProduct.gWeight &&
      currentProduct.mark &&
      currentProduct.markingChargePercent &&
      currentProduct.karat &&
      currentProduct.goldRate
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <View style={styles.TextContainer}>
          <Text style={styles.page}>Pages/ </Text>
          <Text style={styles.ScreenName}>Billing</Text>
        </View> */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Pages / Billing</Text>
            <Text style={styles.headerTitle}>Billing</Text>
          </View>
        </View>

        {isLoading ? (
          <Loading />
        ) : (
          <View style={styles.innnerContainer}>
            <View style={styles.billinginfo}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Billing Information</Text>
                <TouchableOpacity
                  style={styles.createUserButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name="create" size={15} color="black" />
                  <Text style={styles.headerText}>Create Invoice</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
              >
                <FlatList
                  data={invoice}
                  renderItem={({ item }) => (
                    <UserCard
                      name={item?.customerId?.name}
                      company={item?.companyId?.companyName}
                      email={item?.customerId?.email}
                      products={item?.product?.[0]?.productName}
                      vat={item?.billNumber}
                      invoiceId={item?._id}
                    />
                  )}
                  keyExtractor={(item) => item._id.toString()} // Ensure using a unique key
                />
              </ScrollView>
            </View>
          </View>
        )}
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
            <Text style={styles.modalTitle}>Create Invoice</Text>
            {/* Company ID Input */}
            <TextInput
              style={styles.input}
              placeholder="Company ID"
              value={companyName}
              editable={false}
            />
            {/* Search Customer Input */}
            <TextInput
              style={styles.input}
              placeholder="Search Customer"
              value={customerName}
              onChangeText={(text) => {
                setCustomerName(text);
                handleSearch(text);
              }}
            />
            {searchloading && <ActivityIndicator size="small" />}
            {customerName && customers?.length > 0 && (
              <View style={styles.searchlist}>
                <FlatList
                  data={customers}
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

            {/* Product Fields */}
            <ScrollView>
              {invoiceData &&
                invoiceData?.product?.map((product, index) => (
                  <View
                    key={index}
                    style={
                      index === currentProductIndex ? {} : { display: "none" }
                    }
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Search Product Name"
                      value={product?.productName || ""}
                      onChangeText={(text) => {
                        handleProductChange(index, "productName", text);
                        handleSearchProduct(text);
                      }}
                    />
                    {searchloading && <ActivityIndicator size="small" />}
                    {searchProduct.length > 0 && (
                      <View style={styles.searchlist}>
                        <FlatList
                          data={searchProduct}
                          keyExtractor={(item) => item._id.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => handleProductSelect(index, item)} // Use the new function
                            >
                              <View style={styles.customerItem}>
                                <Text>{item.name}</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                    {/* Other Product Fields */}
                    <TextInput
                      style={styles.input}
                      placeholder="Weight"
                      value={product.weight || ""}
                      onChangeText={(text) => {
                        // Use a regular expression to allow only numbers and decimal point
                        const numericText = text.replace(/[^0-9.]/g, "");

                        // Optionally, add logic to prevent more than one decimal point
                        const decimalCount = (numericText.match(/\./g) || [])
                          .length;
                        if (decimalCount <= 1) {
                          handleProductChange(index, "weight", numericText);
                        }
                      }}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Gross Weight"
                      value={product?.gWeight || ""}
                      onChangeText={(text) => {
                        // Use a regular expression to allow only numbers and decimal point
                        const numericText = text.replace(/[^0-9.]/g, "");

                        // Optionally, add logic to prevent more than one decimal point
                        const decimalCount = (numericText.match(/\./g) || [])
                          .length;
                        if (decimalCount <= 1) {
                          handleProductChange(index, "gWeight", numericText);
                        }
                      }}
                      keyboardType="numeric"
                    />
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={product?.mark || ""}
                        style={styles.picker}
                        onValueChange={(itemValue) =>
                          handleProductChange(index, "mark", itemValue)
                        }
                      >
                        <Picker.Item label="HUID" value="HUID" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Marking Charge In Percent"
                      value={product?.markingChargePercent || ""}
                      onChangeText={(text) => {
                        // Use a regular expression to allow only numbers and decimal point
                        const numericText = text.replace(/[^0-9.]/g, "");

                        // Optionally, you can add logic to prevent more than two decimal places
                        const decimalCount = (numericText.match(/\./g) || [])
                          .length;
                        if (decimalCount <= 1) {
                          handleProductChange(
                            index,
                            "markingChargePercent",
                            numericText
                          );
                        }
                      }}
                      keyboardType="numeric"
                    />
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={product?.karat || ""}
                        style={styles.picker}
                        onValueChange={(itemValue) =>
                          handleProductChange(index, "karat", itemValue)
                        }
                      >
                        <Picker.Item label="24 Carat" value="24" />
                        <Picker.Item label="22 Carat" value="22" />
                        <Picker.Item label="18 Carat" value="18" />
                        <Picker.Item label="Local" value="Local" />
                      </Picker>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Gold Rate"
                      value={product?.goldRate || ""}
                      onChangeText={(text) => {
                        // Use a regular expression to allow only numbers and decimal point
                        const numericText = text.replace(/[^0-9.]/g, "");

                        // Optionally, you can add logic to prevent multiple decimal points
                        const decimalCount = (numericText.match(/\./g) || [])
                          .length;
                        if (decimalCount <= 1) {
                          handleProductChange(index, "goldRate", numericText);
                        }
                      }}
                      keyboardType="numeric"
                    />
                    {/* Add other fields similarly */}
                  </View>
                ))}
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  currentProductIndex === 0 ? styles.buttonDisabled : null, // Apply disabled style if on the first product
                ]}
                onPress={handleBackProduct}
                disabled={currentProductIndex === 0} // Disable if on the first product
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  !isProductArrayFilled() ? styles.buttonDisabled : null, // Apply disabled style if the product is not filled
                ]}
                onPress={() => {
                  if (isProductArrayFilled()) {
                    addProduct();
                    setCurrentProductIndex(currentProductIndex + 1); // Move to the next product after adding
                  } else {
                    console.warn(
                      "Please fill all fields in the product array."
                    );
                  }
                }}
                disabled={!isProductArrayFilled()} // Disable if the current product is not filled
              >
                <Text
                  style={[
                    styles.buttonText,
                    !isProductArrayFilled() ? styles.buttonTextDisabled : null,
                  ]}
                >
                  + Add Product
                </Text>
              </TouchableOpacity>
            </View>
            {/* Other Invoice Fields */}
            <TextInput
              style={styles.input}
              placeholder="HM Amount"
              value={invoiceData?.hmAmount || ""}
              onChangeText={(text) =>
                setInvoiceData({ ...invoiceData, hmAmount: Number(text) })
              }
              keyboardType="numeric"
            />
            <View style={styles.switchContainer}>
              <Text>GST Transport</Text>
              <Switch
                value={invoiceData?.gstTransport}
                onValueChange={(value) =>
                  setInvoiceData({ ...invoiceData, gstTransport: value })
                }
              />
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setCustomers([]);
                  setCustomerName("");
                  setSearchProduct([]);
                  setInvoiceData({
                    customerId: "",
                    companyId: "",
                    product: [
                      {
                        productName: "",
                        weight: "",
                        gWeight: "",
                        mark: "HUID",
                        markingChargePercent: "",
                        karat: "22",
                        goldRate: "",
                      },
                    ],
                    hmAmount: Number(""),
                    gstTransport: false,
                  });
                  // setCurrentProductIndex()
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateInvoice}
              >
                <Text style={styles.buttonText}>Create</Text>
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
    backgroundColor: '#F0FFFF'
  },
  TextContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
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
  billinginfo: {
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
    height: height * 0.8,
    marginBottom: height * 0.1,
  },
  scrollViewContent: {
    flexGrow: 1,
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
    width: width * 0.35,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 35,
    width: width * 0.3,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 25,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  // button: {
  //   // Your existing button styles
  //   backgroundColor: 'blue', // Default color
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
  buttonDisabled: {
    backgroundColor: "gray", // Disabled color
  },
  buttonText: {
    color: "white", // Default text color
  },
  buttonTextDisabled: {
    color: "lightgray", // Disabled text color
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 5,
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
    // borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
  },
  picker: {
    height: 35,
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
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
});
