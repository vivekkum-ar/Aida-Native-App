import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/formField'
import { ResizeMode, Video } from 'expo-av'
import { icons, images } from '../../constants'
import CustomButton from '../../components/CustomButton'

const Create = () => {
  const [uploading, setUploading] = useState(false)
  const [Form, setForm] = useState({
    title:"",
    video:null,
    thumbnail:null,
    prompt:"",
    createdByUser:""
  })
  const submit = () => {

  }
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView className="px-4 mt-6">
        <Text className="text-white text-2xl font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={Form.title}
          placeholder="Enter video title"
          handleChangeText={(e) =>
            setForm({ ...Form, title: e.nativeEvent.text })
          }
          otherStyles="mt-10"
        ></FormField>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity>
            {Form.video ? (
              <Video
                source={{ uri: Form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              ></Video>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border-dashed border border-secondary-100 justify-center items-center">
                  <Image
                    className="w-12 h-12"
                    source={icons.upload}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">
            Upload Thumbnail
          </Text>
          <TouchableOpacity>
            {Form.thumbnail ? (
              <Video
                source={{ uri: Form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              ></Video>
            ) : (
              <View className="w-full h-16 border-2 border-black-200 flex-row space-x-2 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <Image
                    className="w-5 h-5"
                    source={icons.upload}
                    resizeMode="contain"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium ">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={Form.prompt}
          placeholder="Enter AI Prompt"
          handleChangeText={(e) =>
            setForm({ ...Form, title: e.nativeEvent.text })
          }
          otherStyles="mt-7"
        ></FormField>
        <CustomButton
          title="Submit & Pulish"
          handlePress={() => {submit}}
          containerStyles="mt-7"
          isLoading={uploading}
          />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Create