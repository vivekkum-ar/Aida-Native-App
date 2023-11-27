import { View, Text, Image, SafeAreaView, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons, images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {data , refetch} = useAppwrite(getAllPosts);
  const latestData = useAppwrite(getLatestPosts);
  // console.log(latestData.data)
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary">
      <FlatList
      data={data}
      keyExtractor={(item) => (item.$id)}
      renderItem={({ item }) => (
        <VideoCard
        key={item.$id}
        video = {item} 
        />
      )}
      ListHeaderComponent={() => (
        <View className="my-16 px-4 space-y-6">
          <View className="flex flex-row justify-between items-start">
            <View className="">
              <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
              <Text className="font-psemibold text-2xl text-white">Viv</Text>
            </View>
            <View className="mt-1.5">
              <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain'></Image>
            </View>
          </View>
          <SearchInput placeholder={"Search for a video"}/>
           <View className="w-full pt-5 pb-8 flex-1">
            <Text className="text-gray-100 text-pregular text-lg mb-3">
              Latest Videos
            </Text>
            <Trending 
            className=""
            posts = {latestData.data ?? []} 
            />
           </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <EmptyState 
        title = {"No videos found"}
        description = {"Please try again later"}
        />
      )}
      refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} ></RefreshControl> }
      >
      </FlatList>

    </SafeAreaView>
  )
}

export default Home