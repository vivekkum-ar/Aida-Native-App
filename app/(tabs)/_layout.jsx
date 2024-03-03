import { StyleSheet, Text, View, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import Ionicons from "@expo/vector-icons/Ionicons";
const TabIcon = ({icon, color, name, focused}) => {
  return (
    <View className="flex justify-center items-center gap-1">
      <Image source={icon}
      resizeMode="contain"
      tintColor={color}
      className="w-6 h-6 m-0 p-0"
      />
      {/* <Ionicons.Button className="bg-secondary-200" size={25} name="airplane-outline"/> */}
      <Text className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`} style={{color:color}}>{name}</Text>
    </View>
  );
};
const TabsLayout = () => {
  return (
    <>
      <Tabs className="bg-black-200" screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor:"#ffa001",
        tabBarInactiveTintColor:"#cdcde0",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth:1,
          borderTopColor:"#232533",
          height: 84,
        },
      }}>
      <Tabs.Screen
          name="home"
          options={{
            // title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="liked"
          options={{
            title: "Liked",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.like} //todo : change icon to like icon
                color={color}
                name="Liked"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            // href: "/profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};
const styles = StyleSheet.create({
  imgF: {
    width: 200,
    height: 200,
  },
});
export default TabsLayout;
