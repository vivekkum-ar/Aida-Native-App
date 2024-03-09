import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";

const CustomModal = ({
  ModalVisibility,
  UpdateModalVisibility,
  closeButton,
  closeButtonText,
  AlertMessage,
  AlertTitle,
  widthFix,
  children
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={ModalVisibility}
      onRequestClose={() => {
        UpdateModalVisibility(!ModalVisibility);
      }}
      // onShow={() => {}}
      // onDismiss={() => {}}
    >
      <View className="flex-1 justify-center items-center bg-primary opacity-50"></View>
      <View className="absolute h-[100%] w-[100%] justify-center items-center ">
        <View className="mx-2 rounded-lg border border-[#cdcde0] p-4 bg-primary">
          <Text className="font-psemibold border-b border-[#cdcde0] mb-2 text-lg text-gray-100 mx-2">
            {AlertTitle}
          </Text>
          <Text
            className={`font-pmedium text-sm text-gray-100 ${
              widthFix ? "w-72" : ""
            } mx-2`}
          >
            {AlertMessage}
          </Text>
          {children}
          <View className="justify-between items-end">
            {closeButton && (
              <TouchableOpacity
                className="mt-4"
                onPress={() => {
                  UpdateModalVisibility(!ModalVisibility);
                }}
              >
                <View className="flex items-center justify-center px-2 border border-secondary rounded-md">
                  <Text className="font-psemibold text-md text-secondary text-center">
                    {closeButtonText ? closeButtonText : "Close"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;