import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
// import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  return(
    <View style={styles.container}>
        <ThemedText> You would not believe your eyes</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });