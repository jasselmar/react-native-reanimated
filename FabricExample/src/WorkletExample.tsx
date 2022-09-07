/* global _WORKLET */
import { Button, StyleSheet, View } from 'react-native';
import {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import React from 'react';

declare global {
  const _WORKLET: boolean;
}

export default function WorkletExample() {
  // runOnUI demo
  const someWorklet = (number: number) => {
    'worklet';
    console.log(_WORKLET, number); // _WORKLET should be true
  };

  const handlePress1 = () => {
    runOnUI(someWorklet)(Math.random());
  };

  // runOnJS demo
  const x = useSharedValue(0);

  const someFunction = (number: number) => {
    console.log(_WORKLET, number); // _WORKLET should be false
  };

  useDerivedValue(() => {
    runOnJS(someFunction)(x.value);
  });

  const handlePress2 = () => {
    x.value = Math.random();
  };

  // useAnimatedStyle(() => {
  //   // first call is always from JS thread
  //   // eslint-disable-next-line no-undef
  //   if (_WORKLET !== true) {
  //     throw new Error('Hello world!');
  //   }
  //   return {};
  // });

  const handlePress3 = () => {
    throw new Error('Hello world!');
  };

  const handlePress4 = () => {
    runOnUI(() => {
      'worklet';
      throw new Error('Hello world!');
    })();
  };

  const handlePress5 = () => {
    runOnUI(() => {
      'worklet';
      (() => {
        'worklet';
        throw new Error('Hello world!');
      })();
    })();
  };

  return (
    <View style={styles.container}>
      <Button onPress={handlePress1} title="runOnUI demo" />
      <Button onPress={handlePress2} title="runOnJS demo" />
      <Button onPress={handlePress3} title="Throw error on JS" />
      <Button onPress={handlePress4} title="Throw error from worklet" />
      <Button onPress={handlePress5} title="Throw error from nested worklet" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
