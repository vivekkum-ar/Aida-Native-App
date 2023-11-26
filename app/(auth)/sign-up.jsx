import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/formField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
const SignUp = () => {
  const [Form, setForm] = useState({
    username:"",
    email:"",
    password:""
  })
 
 const submit = () => {

 }
 const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className=""  contentContainerStyle={{height: "100%"}}>
        <View className="w-full  justify-center min-h-[85vh] my-auto px-6">
        <View className="flex flex-row items-center 
          justify-start">
          <Image 
          source={images.logoSmall} 
          className="w-[60px] h-[44px]"
          resizeMode="contain"
          />
          <Text className="inline-flex text-3xl text-white font-psemibold pt-[16 px]">Aida</Text>
          </View>
          <Text className="text-2xl text-start text-white mt-10 font-psemibold">Sign up to Aida</Text>
          <FormField
          title={"Username"}
          value={Form.username}
          handleChangeText={(e) => {setForm({...Form,username:e})}}
          otherStyles={"mt-10"}
          />
          <FormField
          title={"Email"}
          value={Form.email}
          handleChangeText={(e) => {setForm({...Form,email:e})}}
          otherStyles={"mt-7"}
          keyBoardType={"email-address"}
          />
          <FormField
          title={"Password"}
          value={Form.password}
          handleChangeText={(e) => {setForm({...Form,password:e})}}
          otherStyles={"mt-7"}
          />
          <CustomButton
          title={"Sign In"}
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
      <Text>SignUp</Text>
    </SafeAreaView>
  )
}

export default SignUp