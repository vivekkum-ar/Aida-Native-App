import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/formField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/globalProvider";
import CustomModal from '../../components/CustomModal'

const SignUp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: ""});
  const { setUser, setIsLogged } = useGlobalContext();
  const [Form, setForm] = useState({
    username:"",
    email:"",
    password:""
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
 const submit = async () => {
  if(!Form.username || !Form.email || !Form.password) {
    // Alert.alert("Error","Please fill all fields");
    setAlertData({title:"Error",message:"Please fill all fields"});
    setModalVisible(true);
  }
  else {
 setIsSubmitting(true);
 try {
  const result = await createUser(Form.email,Form.password,Form.username);
  setUser(result);
  setIsLogged(true);
  router.replace("/home");
 } catch (error) {
  // Alert.alert("Error",error.message);
  setAlertData({title:"Error",message:"Please enter your email"});
    setModalVisible(true);
 }
 finally {
    setIsSubmitting(false);
  }
 }
}
  return (
    <SafeAreaView className="bg-primary h-full">
      <CustomModal
      ModalVisibility={modalVisible}
      UpdateModalVisibility={setModalVisible}
      closeButton={true}
      AlertMessage={alertData.message}
      AlertTitle={alertData.title}
      closeButtonText="OK"
      widthFix={true}
      />
      <ScrollView className=""  contentContainerStyle={{height: "100%"}}>
        <View className="w-full  justify-center min-h-[85vh] my-auto px-6">
        <View className="flex flex-row items-center 
          justify-start">
          <Image 
          source={images.logoSmall} 
          className="w-[60px] h-[44px] scale-150"
          resizeMode="contain"
          />
          <Text className="inline-flex text-3xl text-white font-psemibold pt-[16 px]">Aida</Text>
          </View>
          <Text className="text-2xl text-start text-white mt-10 font-psemibold">Sign up to Aida</Text>
          <FormField
          title={"Username"}
          value={Form.username}
          handleChangeText={(e) => {setForm({...Form,username:e.nativeEvent.text})}}
          otherStyles={"mt-10"}
          />
          <FormField
          title={"Email"}
          value={Form.email}
          handleChangeText={(e) => {setForm({...Form,email:e.nativeEvent.text})}}
          otherStyles={"mt-7"}
          keyBoardType={"email-address"}
          />
          <FormField
          title={"Password"}
          value={Form.password}
          handleChangeText={(e) => {setForm({...Form,password:e.nativeEvent.text})}}
          otherStyles={"mt-7"}
          />
          <CustomButton
          title={"Sign Up"}
          handlePress={submit}
          containerStyles={"mt-7"}
          isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link href={"/sign-in"} className='text-lg text-secondary font-psemibold'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp