import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import FormField from "../../../components/formField";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../../constants";
import * as DocumentPicker from "expo-document-picker";
import { ResizeMode } from "expo-av";
import CustomButton from "../../../components/CustomButton";

const EditProfile = () => {
  const [Form, setForm] = useState({
    name: "",
    updatedUserName: "",
    updatedEmail: "",
  });

  const openFilePicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/gif"],
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...Form, thumbnail: result.assets[0] });
        // console.log(Form)
      }
      if (selectType === "video") {
        setForm({ ...Form, video: result.assets[0] });
        // console.log(result)
      }
    } else if (result.canceled) {
      // Alert.alert("No Document picked","Please pick a document");
      // console.log("first");
      setAlertData({
        title: "No Document Picked",
        message: "Please pick a document",
      });
      setModalVisible(true);
      return;
    } else {
      setTimeout(() => {
        // Alert.alert("Document picked",JSON.stringify(result,null,2));
        setAlertData({
          title: "Document Picked",
          message: JSON.stringify(result, null, 2),
        });
        setModalVisible(true);
        // Alert.alert("No Document picked","Please pick a document");
      }, 100);
    }
  };
  return (
    <SafeAreaView className="bg-primary px-4 ">
      <ScrollView className="" scrollsToTop>
        <Text className="font-psemibold text-2xl text-white py-4">
          Edit Profile
        </Text>
        <View className="mt-7 space-y-2">
          <TouchableOpacity
            className="flex justify-center items-center"
            onPress={() => {
              openFilePicker("image");
            }}
          >
            {Form.thumbnail ? (
              <>
                <Image
                  source={{ uri: Form.thumbnail.uri }}
                  className="h-32 w-32 rounded-full"
                  resizeMode={ResizeMode.COVER}
                  borderWidth={2}
                  borderColor="#cdcde0"
                ></Image>
                <Image source={icons.upload} className="h-10 w-10 absolute top-12 border-2 rounded-full border-secondary bg-primary" borderWidth={2} borderColor="#fc9001"/>
                <Text className="text-sm mb-10 mt-2 text-gray-100 font-pmedium">
                  Change Profile Picture
                </Text>
              </>
            ) : (
              <View className="w-full h-16 border-2 border-black-200 flex-row space-x-2 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <Image
                  className="w-5 h-5"
                  source={icons.upload}
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium ">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* <Text className="text-white text-2xl font-psemibold">Upload Video</Text> */}
        <FormField
          title="Name"
          value={Form.name}
          placeholder="Enter your name"
          handleChangeText={(e) =>
            setForm({ ...Form, name: e.nativeEvent.text })
          }
          //   otherStyles="mt-10"
        ></FormField>
        <FormField
          title="Username"
          value={Form.updatedUserName}
          placeholder="Enter new username"
          handleChangeText={(e) =>
            setForm({ ...Form, updatedUserName: e.nativeEvent.text })
          }
          otherStyles="mt-10"
        ></FormField>
        <FormField
          title="Email"
          value={Form.updatedEmail}
          placeholder="Enter new email"
          handleChangeText={(e) =>
            setForm({ ...Form, updatedEmail: e.nativeEvent.text })
          }
          otherStyles="my-10"
        ></FormField>
        <CustomButton title="Change Password" className="mt-10"></CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  main: {
    backgroundColor: "#161622",
    // margin:"20px 20px 20px 20px",
    marginTop: "20px",
    paddingTop: "20px",
  },
});
export default EditProfile;
