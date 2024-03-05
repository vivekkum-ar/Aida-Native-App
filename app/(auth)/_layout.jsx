import { View, Text } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="reset-pass" options={{ headerShown: false }} />
      </Stack>
      <View className="bg-primary w-full justify-center">
        <Text className="text-[#cdcde0] w-full text-center opacity-60"> You agree to 
          <Link className='text-secondary font-psemibold' href={"https://aidain.web.app"}>
          &nbsp;Terms&nbsp;
          </Link>
           and 
           <Link className='text-secondary font-psemibold' href={"https://aidain.web.app"}>
          &nbsp;Privacy&nbsp;
          </Link>
            if you continue</Text>
      </View>
      <StatusBar style="light" backgroundColor="#161622" />
    </>
  );
}

export default AuthLayout