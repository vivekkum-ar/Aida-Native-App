import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const CustomBottomSheet = forwardRef((props,ref) => {
// variables
const snapPoints = useMemo(() => props.snapPoints, []);


const handleSheetChanges = useCallback((index) => {
  // console.log("handleSheetChanges", index);
}, []);
// renders
const renderBackdrop = useCallback(
  (props) => (
    <BottomSheetBackdrop {...props} opacity={0.5} pressBehavior={"close"} />
  ),
  []
);

  return (
    <BottomSheetModal
    onAccessibilityAction={(e) => {
      console.log("onAccessibilityAction", e);
    }}
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleComponent={() => (
        props.handleComponent
      )}
      // detached={true}
      // add bottom inset to elevate the sheet
      bottomInset={props.bottomInset}
      className=" rounded-full"
      style={{ marginHorizontal: 16, borderCurve: "circular", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      // set `detached` to true
      detached={true}
      enablePanDownToClose={true}
      animateOnMount={true}
    >
      <BottomSheetView
        style={{paddingHorizontal:16, backgroundColor: "#cdcde0", height: "100%", borderBottomLeftRadius: 17, borderBottomRightRadius: 17 }}
      >
        {props.children}
      </BottomSheetView>
    </BottomSheetModal>
  )
});

export default CustomBottomSheet