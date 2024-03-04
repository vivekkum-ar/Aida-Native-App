import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const EditProfile = () => {
  return (
    <View style={style.main}>
      <Text style={style.text}>EditProfile</Text>
    </View>
  )
}

const style = StyleSheet.create({
  main:{
    backgroundColor:"#161622",
    // margin:"20px 20px 20px 20px",
    marginTop:"20px",
    paddingTop:"20px"
  },
  text:{
    color:"#cdcde0",
    marginTop:"20px",
    paddingTop:"20px"
  }
})
export default EditProfile