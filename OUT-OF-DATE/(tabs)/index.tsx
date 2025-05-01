import { ImageBackground, StyleSheet, Text, View } from "react-native";
import * as React from 'react';

import bImage from '@/assets/images/image-id-11068331-jpeg.jpg';

//const image = {uri: 'https://www.rawpixel.com/image/11068331/image-cloud-cow-art'}
export default function Index() {
  return (
    <View style={styles.container}>
      <ImageBackground source={bImage} resizeMode="cover" style={styles.image} >
        <header>
          for why
        </header>
      </ImageBackground>
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
  image: {
    position: "relative",
    flex: 1,
    height:'100%',
    width:'100%'
  }
});