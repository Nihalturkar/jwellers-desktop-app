import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { BarChart } from "react-native-chart-kit";
import { GetDashboardApi } from "../../api/dashboard";
import CustomCard from "../components/card"
import Loading from "../components/loading";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default function Dashboard() {
  // const { name } = route.params || {};
  // console.log("Dashboard name:", name);
  const [loading, setLoading] = useState(false);
  const [data, SetData] = useState([]);
  useEffect(() => {
    GetDashboardApi((load, res) => {
      setLoading(load)
      if (res?.success) {
        SetData(res?.data)
      }
    })
  }, [])

  const monthlyCounts = data?.monthlyCounts || [];
  const labels = monthlyCounts.map(item => item.month);
  const counts = monthlyCounts.map(item => item.count); 

  const barChartData = {
    labels:labels,
    datasets: [
      {
        data:counts,
      },
    ],
  };

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        data: counts,
        strokeWidth: 2,
      },
    ],
  };

  return (
      <View style={styles.content}>
          <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Pages / DashBoard</Text>
            <Text style={styles.headerTitle}>DashBoard</Text>
          </View>
        </View>
         {/* <Loading/> */}
        {loading ? (
          // <View style={{ position: 'absolute', top: height * 0.45, left: width * 0.3 }}>
          //   <Text style={styles.ScreenName}>Fetching Data, Please wait ....</Text>
          //   <ActivityIndicator size="large" color="#0000ff" />
          // </View>
          <Loading/>
        ) : (
          <>
        <View style={styles.card}>  
          <CustomCard pname='Yearly Money' money={(data?.totalAmountYear)}/>
          <CustomCard pname='Monthly Money' money={(data?.totalAmountMonth)}/>
          <CustomCard pname='Today Money' money={(data?.totalAmountToday)}/>  
        </View>
      
        <View style={styles.chartContainer}>
          <BarChart
            data={barChartData}
            width={width * .8} // Adjust width to fit the screen
            height={height * .6}
            chartConfig={{
              // backgroundColor: "#e26a00",
              backgroundGradientFrom: "black",
              backgroundGradientTo: "black",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 10,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          {/* <LineChart
            data={lineChartData}
            width={width * .4} // Adjust width to fit the screen
            height={height * .5}
            yAxisLabel="₹"
            chartConfig={{
              backgroundGradientFrom: "red",
              backgroundGradientTo: "black",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Line color
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label color
              style: {
                borderRadius: 10,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "1",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          /> */}

          
        </View>
        </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    height: "200%",
    backgroundColor:'#F0FFFF'
  },
  scrollContainer: {
    flexGrow: 1,
    height: "120%",
  },
  ScreenName: {
    fontSize: width * 0.011,
    fontWeight: 500
  },
  content: {
    flexGrow: 1,
    backgroundColor:'#F0FFFF'
  },
  TextContainer: {
    flexDirection: "row",
  },
  page: {
    color: "#A0AEC0",
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
  dashboard: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  chartContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
    gap:width*.005,
  },
});
