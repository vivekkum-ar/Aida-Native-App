import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View } from 'react-native';
import CreateUpload from './index';
import Ionicons from "@expo/vector-icons/Ionicons";
import AiVideo from './aivideo';

const Tab = createMaterialTopTabNavigator();

const TabBarIcon = ({icon, color, name}) => {
    return(
      <View className="flex flex-row w-20 items-center justify-center -translate-x-5"><Ionicons name={icon} size={25} color={color}/><Text style={{color:color}} className="font-pmedium">{" "}{name}</Text></View>
    );
  }
const Layout = () => {
  return (
    <Tab.Navigator screenOptions={{
        tabBarShowLabel:false,
        tabBarActiveTintColor:"#ffa001",
        tabBarInactiveTintColor:"#cdcde0",
        tabBarPressColor:"#cdcde0",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth:1,
          borderTopColor:"#232533",
          height: 54,
          // paddingTop:10,
          marginTop:30,
        },
        tabBarContentContainerStyle: {
          // paddingTop:10,
        },
  
        tabBarAndroidRipple: true,
      }}>
        
        <Tab.Screen name="Upload" component={CreateUpload} options={{
          tabBarIcon:({color}) => (
            <TabBarIcon
              icon="cloud-upload-outline"
              color={color}
              name="Upload"
            />
          ),
          tabBarIndicatorStyle: {
            backgroundColor:"#ffa001",
            borderColor:"#ffa001",
            borderWidth:2,
          },
        }}/>
        <Tab.Screen name="Imagine" component={AiVideo} options={{
          tabBarIcon:({color}) => (
            <TabBarIcon
              icon="videocam-outline"
              color={color}
              name="A.I. Video"
            />
          ),
          tabBarIndicatorStyle: {
            backgroundColor:"#ffa001",
            borderColor:"#ffa001",
            borderWidth:2
          },
        }}/>
      </Tab.Navigator>
  )
}

export default Layout