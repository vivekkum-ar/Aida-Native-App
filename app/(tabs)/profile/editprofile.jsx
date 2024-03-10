import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import FormField from "../../../components/formField";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../../constants";
import * as DocumentPicker from "expo-document-picker";
import { ResizeMode } from "expo-av";
import CustomButton from "../../../components/CustomButton";
import { useGlobalContext } from "../../../context/globalProvider";
import CustomModal from "../../../components/CustomModal";
import { editProfileData, signOut } from "../../../lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const EditProfile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "" });
  const { user, setIsLogged } = useGlobalContext();
  const handleSaveStorageClear = async () => {
    await AsyncStorage.setItem(user.$id, JSON.stringify([]));
    await AsyncStorage.setItem(`${user.$id}_ids`, JSON.stringify([]));
    // ToastAndroid.show("Data Cleared", ToastAndroid.SHORT);
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
    router.replace("/reset-pass");
  };
  // console.log(user.avatar);
  const [Form, setForm] = useState({
    name: "",
    updatedUserName: "",
    updatedEmail: "",
  });

  const updateName = async () => {
   if(!Form.name || !Form.updatedUserName){
    setAlertData({title:"Error", message:"Please fill all fields"});
    setModalVisible(true);
    return;
   } else{
    try {
      await editProfileData(Form.name,Form.updatedUserName,user.$id);
      setAlertData({
        title:"Success",
        message:"Name updated successfully"
      });
      setModalVisible(true);
    } catch (error) {
      setAlertData({ title: "Error", message: error.message });
      setModalVisible(true);
    }
   }
  }
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
      <CustomModal
        AlertMessage={alertData.message}
        AlertTitle={alertData.title}
        ModalVisibility={modalVisible}
        UpdateModalVisibility={setModalVisible}
        widthFix={true}
        // closeButton={true}
        // closeButtonText={"Close"}
        children={
          <View className="justify-end gap-x-4 flex flex-row items-end">
            <TouchableOpacity
              className="mt-4"
              onPress={() => {
                setModalVisible(!modalVisible);
                // logout();
              }}
            >
              <View className="flex items-center justify-center px-2 border border-secondary rounded-md">
                <Text className="font-psemibold text-md text-secondary text-center">
                  Ok
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View className="flex items-center justify-center px-2 border border-secondary rounded-md">
                <Text className="font-psemibold text-md text-secondary text-center">
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      ></CustomModal>
      <ScrollView className="">
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
                <Image
                  source={icons.upload}
                  className="h-10 w-10 absolute top-12 border-2 rounded-full border-secondary bg-primary"
                  borderWidth={2}
                  borderColor="#fc9001"
                />
                <Text className="text-sm mb-10 mt-2 text-gray-100 font-pmedium">
                  Change Profile Picture
                </Text>
              </>
            ) : (
              <>
                <Image
                  source={{ uri: user.avatar }}
                  className="h-32 w-32 rounded-full"
                  resizeMode={ResizeMode.COVER}
                  borderWidth={2}
                  borderColor="#cdcde0"
                ></Image>
                <Image
                  source={icons.upload}
                  className="h-10 w-10 absolute top-12 border-2 rounded-full border-secondary bg-primary"
                  borderWidth={2}
                  borderColor="#fc9001"
                />
                <Text className="text-sm mb-10 mt-2 text-gray-100 font-pmedium">
                  Change Profile Picture
                </Text>
              </>
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
          otherStyles="mt-10 mb-6"
        ></FormField>

        <CustomButton
          title="Update Profile"
          className=""
          containerStyles={"mb-4"}
          primaryColor="bg-secondary-200 text-white"
          textStyles={"text-white"}
          handlePress={updateName}
        ></CustomButton>

        <CustomButton
          title="Change Password"
          className=""
          primaryColor="bg-red-500 text-white"
          textStyles={"text-white"}
          handlePress={() => {
            setAlertData({
              title: "Change Password",
              message: (
                <Text>
                  For added <Text className="text-red-500">security</Text>, you
                  will be logged out! Press Ok to continue.
                </Text>
              ),
            });
            setModalVisible(true);
          }}
        ></CustomButton>
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
