import {
    View,
    Image,
    SafeAreaView,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ToastAndroid,
  } from "react-native";
  import React, { useEffect, useRef, useState } from "react";
  import { icons } from "../../../constants";
  import EmptyState from "../../../components/EmptyState";
  import { getUserPost, signOut } from "../../../lib/appwrite";
  import useAppwrite from "../../../lib/useAppwrite";
  import VideoCard from "../../../components/VideoCard";
  import { router,useNavigation } from "expo-router";
  import { useGlobalContext } from "../../../context/globalProvider";
  import InfoBox from "../../../components/InfoBox";
  import LottieView from "lottie-react-native";
  import millify from "millify";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { Ionicons } from "@expo/vector-icons";
  // import { DrawerActions } from "expo-router/drawer";
  
  const UserDashboard = () => {
    const navigation = useNavigation();
    const { user, setIsLogged } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
    const { data, setData, refetch } = useAppwrite(() =>
      getUserPost(user.$id, 0, true)
    );
    const [loading, setLoading] = useState(true);
    const handleSaveStorageClear = async () => {
      await AsyncStorage.setItem(user.$id, JSON.stringify([]));
      await AsyncStorage.setItem(`${user.$id}_ids`, JSON.stringify([]));
      // ToastAndroid.show("Data Cleared", ToastAndroid.SHORT);
    };
  
    const onScrollEnd = async () => {
      if (data.length > 1) {
        try {
          // ToastAndroid.show("End Reached", ToastAndroid.SHORT);
          const res = await getUserPost(
            user.$id,
            data[data.length - 1].$id,
            false
          );
          setData([...data, ...res]);
          let timer;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            setLoading(false);
          }, 2000);
        } catch (error) {
          let timer;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            setLoading(false);
          }, 2000);
          throw new Error(error);
        }
      } else return;
    };
    // console.log("hi",posts)
    const onRefresh = async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    };
    
    const logout = async () => {
      await signOut();
      // gives error $id is null
      // setUser(null);
  
      /* ---------------------------------------------- - --------------------------------------------- */
      /* ----------- Delete all data from storage when user logs out to prevent data leakage ---------- */
      /* ---------------- otherwise user will be able to see the data of previous user ---------------- */
      /* ---------------------------------------------- - --------------------------------------------- */
      handleSaveStorageClear();
      
      setIsLogged(false);
      router.replace("/sign-in");
    };
  
    const animation = useRef(null);
    useEffect(() => {
      // You can control the ref programmatically, rather than using autoPlay
      animation.current?.play();
    }, []);
  
    return (
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard key={item.$id} video={item} docId={item.$id} />
          )}
          ListHeaderComponent={() => (
            <View className="w-full flex justify-center items-center mt-12 mb-12 px-4">
              <TouchableOpacity
                className="flex w-full items-end mb-6"
                onPress={() => navigation.openDrawer()}
                activeOpacity={0.5}
              >
                <View className="border border-[#cdcde0] opacity-70 p-2 rounded-lg">
                <Image
                  source={icons.linesmenu}
                  resizeMode="contain"
                  className="w-6 h-6 "
                />
                </View>
              </TouchableOpacity>
              <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
  
              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />
  
              <View className="mt-5 flex flex-row">
                <InfoBox
                  title={data.length || 0}
                  subtitle="Posts"
                  titleStyles="text-xl"
                  containerStyles="mr-10"
                />
                <InfoBox
                  title={millify(user.followedByUsers.length) || 0}
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title={"No videos found"}
              description={"Please try again later"}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            ></RefreshControl>
          }
          onEndReachedThreshold={0.9}
          onEndReached={() => {
            if (data.length > 1) {
              onScrollEnd();
            }
          }}
          ListFooterComponent={() =>
            loading && (
              <View className="flex flex-row justify-center">
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 800,
                    height: 100,
                    // backgroundColor: '#eee',
                  }}
                  className="scale-150 border border-white "
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../assets/LottieLoading.json")}
                />
              </View>
            )
          }
        ></FlatList>
      </SafeAreaView>
    );
  };
  
  export default UserDashboard;
  