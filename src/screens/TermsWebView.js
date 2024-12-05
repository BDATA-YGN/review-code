import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import ActionAppBar from '../commonComponent/ActionAppBar';
import AppBar from '../components/AppBar';
import {useNavigation} from '@react-navigation/native';

const TermsWebView = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.webViewContainer}>
      <AppBar isbackArrow onPressBack={() => navigation.goBack()} />
      <WebView source={{uri: 'https://www.myspace.com.mm/terms/terms'}} />
    </SafeAreaView>
  );
};

export default TermsWebView;

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    width: '100%',
  },
});
