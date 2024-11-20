import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import DashBoad from "./DashBoad";
import Billing from "./Billing";
import Dashboard from "./DashBoad";
import Customer from "./Customer";
import Profile from "./Profile";
import Category from "./Category";
import Stocks from "./Stock";

function BillingScreen() {
  return (
    <View style={styles.pageContent}>
      <Text>Billing Screen</Text>
    </View>
  );
}

function StockScreen() {
  return (
    <View style={styles.pageContent}>
      <Text>Stock Screen</Text>
    </View>
  );
}

function CategoryScreen() {
  return (
    <View style={styles.pageContent}>
      <Text>Category Screen</Text>
    </View>
  );
}

function CustomerScreen() {
  return (
    <View style={styles.pageContent}>
      <Text>Customer Screen</Text>
    </View>
  );
}

function DashboardScreen() {
  return (
    <View style={styles.pageContent}>
      <Text>Dashboard Screen</Text>
    </View>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState("Dashboard");
  const [activeButton, setActiveButton] = useState("Dashboard");

  const handleButtonClick = (screen) => {
    setActiveScreen(screen);
    setActiveButton(screen);
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "Dashboard":
        return <Dashboard />;
      case "Billing":
        return <Billing />;
      case "Stock":
        return <Stocks />;
      case "Category":
        return <Category />;
      case "Customer":
        return <Customer />;
      case "Profile":
        return <Profile />
      default:
        return <DashBoad />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Drawer */}
      <View style={styles.drawer}>
        <View>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
        {/* Drawer Items */}
        <TouchableOpacity
          onPress={() => handleButtonClick("Dashboard")}
          style={[
            styles.drawerItem,
            activeButton === "Dashboard" && styles.activeDrawerItem,
          ]}
        >
          <View
            style={[
              styles.drawerIconView,
              { backgroundColor: activeButton === "Dashboard" ? "#4FD1C5" : "#fff" },
            ]}
          >
            <Image
              source={require("../../assets/Images/home.png")} // Replace with your image path
              style={[
                styles.drawerIcon,
                { tintColor: activeButton === "Dashboard" ? "#fff" : "#4FD1C5" }
              ]}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              activeButton === "Dashboard" && styles.activeDrawerItemText,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("Billing")}
          style={[
            styles.drawerItem,
            activeButton === "Billing" && styles.activeDrawerItem,
          ]}
        >
          <View
            style={[
              styles.drawerIconView,
              { backgroundColor: activeButton === "Billing" ? "#4FD1C5" : "#fff" },
            ]}
          >
            <Image
              source={require("../../assets/Images/card.png")}
              style={[
                styles.drawerIcon,
                { tintColor: activeButton === "Billing" ? "#fff" : "#4FD1C5" }
              ]}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              activeButton === "Billing" && styles.activeDrawerItemText,
            ]}
          >
            Billing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("Stock")}
          style={[
            styles.drawerItem,
            activeButton === "Stock" && styles.activeDrawerItem,
          ]}
        >
          <View
            style={[
              styles.drawerIconView,
              { backgroundColor: activeButton === "Stock" ? "#4FD1C5" : "#fff" },
            ]}
          >
            <Image
              source={require("../../assets/Images/chart.png")}
              style={[
                styles.drawerIcon,
                { tintColor: activeButton === "Stock" ? "#fff" : "#4FD1C5" }
              ]}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              activeButton === "Stock" && styles.activeDrawerItemText,
            ]}
          >
            Stock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("Category")}
          style={[
            styles.drawerItem,
            activeButton === "Category" && styles.activeDrawerItem,
          ]}
        >
          <View
            style={[
              styles.drawerIconView,
              { backgroundColor: activeButton === "Category" ? "#4FD1C5" : "#fff" },
            ]}
          >
            <Image
              source={require("../../assets/Images/category.png")}
              style={[
                styles.drawerIcon,
                { tintColor: activeButton === "Category" ? "#fff" : "#4FD1C5" }
              ]}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              activeButton === "Category" && styles.activeDrawerItemText,
            ]}
          >
            Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("Customer")}
          style={[
            styles.drawerItem,
            activeButton === "Customer" && styles.activeDrawerItem,
          ]}
        >
          <View
            style={[
              styles.drawerIconView,
              { backgroundColor: activeButton === "Customer" ? "#4FD1C5" : "#fff" },
            ]}
          >
            <Image
              source={require("../../assets/Images/customers.png")}
              style={[
                styles.drawerIcon,
                { tintColor: activeButton === "Customer" ? "#fff" : "#4FD1C5" }
              ]}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              activeButton === "Customer" && styles.activeDrawerItemText,
            ]}
          >
            Customers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("Profile")}
          style={[
            styles.drawerItem,
            activeButton === "Profile" && styles.activeDrawerItem,
          ]}
        >
          <View
            style={[
              styles.drawerIconView,
              { backgroundColor: activeButton === "Profile" ? "#4FD1C5" : "#fff" },
            ]}
          >
            <Image
              source={require("../../assets/Images/user.png")}
              style={[
                styles.drawerIcon,
                { tintColor: activeButton === "Profile" ? "#fff" : "#4FD1C5" }
              ]}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              activeButton === "Profile" && styles.activeDrawerItemText,
            ]}
          >
            My Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Page Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  drawer: {
    width: 250,
    backgroundColor: "#F8F9FA",
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "transparent",
  },
  activeDrawerItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 10,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"
  },
  // drawerIcon: {
  //   width: 24,
  //   height: 24,
  // },
  drawerItemText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#A0AEC0",
  },
  drawerIconView: {
    backgroundColor: "#4FD1C5",
    marginRight: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    borderRadius: 10,
  },
  drawerIcon: {
    marginTop: 12,
    tintColor: "#fff",
    width: 24,
    height: 24,
  },
  // drawerIconView: {
  //   width: 30,
  //   height: 30,
  //   borderRadius: 10,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   overflow: 'hidden',
  //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"
  // },
  activeDrawerItemText: {
    color: "black",
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  pageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  logo: {
    width: 120,
    height: 80,
    alignSelf: 'center',
    tintColor: "#000",
    resizeMode: 'cover'
  }
});