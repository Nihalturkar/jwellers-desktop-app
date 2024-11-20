import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const CustomCard =({pname,money}) =>{
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.Text1}>{pname || 'Money'}</Text>
        <View style={styles.TextContainer}>
          <Text style={styles.Text2}>₹{money || '0'}</Text>
          {/* <Text style={styles.Text3}>+55%</Text> */}
        </View>
      </View>

      <View style={styles.drawerIconView}>
        <Image
          source={require("../../assets/Images/home.png")}
          style={styles.drawerIcon}
        />
      </View>
    </View>
  );
}

export default CustomCard;
const styles = StyleSheet.create({
  container: {
    width: 350,
    height:80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  TextContainer: { flexDirection: "row", justifyContent: "space-between" },
  Text1: {
    fontSize: 15,
    marginLeft: 10,
    color: "#A0AEC0",
  },
  Text2: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
    marginTop: 5,
  },
  Text3: {
    fontSize: 15,
    marginTop: 7,
    marginLeft: 5,
    color: "#48BB78",
  },
  drawerIconView: {
    backgroundColor: "#4FD1C5",
    marginRight: 10,
    width: 50,
    height: 50,
    alignItems:'center',
    borderRadius: 10,
  },
  drawerIcon: {
    marginTop:12,
    tintColor: "#fff",
    width: 24,
    height: 24,
  },
});
