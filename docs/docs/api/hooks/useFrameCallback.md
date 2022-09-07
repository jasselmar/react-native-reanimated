---
id: useFrameCallback
title: useFrameCallback
sidebar_label: useFrameCallback
---

This hook allows you to run a piece of code on every frame update.

```js
useFrameCallback(callback: (frameTimings: FrameTime) => void, autostart = true): [FrameCallback]
```

### Arguments

#### `callback` [Function]

A single worklet function that will be called on every frame update.
This function receives a [`FrameTime`](#frametime-object) object as an argument.

#### `autostart` [boolean]

Optional boolean that specifies if the callback should start running when
registration is complete. This argument defaults to `true`.

### Returns

An object of type [`FrameCallback`](#framecallback-object) which allows you to read and control the
callback state.

### Types

#### `FrameCallback: [object]`

Properties:
* `setActive: (isActive: boolean) => void`: begins / stops listening for frame updates
* `isActive: boolean`: indicates whether the callback is active (`true`)
                    or not (`false`)
* `callbackId: number`: a unique identifier of the callback function

#### `FrameTime: [object]`

Properties:
* `timestamp: number`: the current system time (in milliseconds)
* `duration: number | undefined`: time (in milliseconds) since last frame - this value
  will be `undefined` on the first frame after activation. Starting from the second frame,
  it should be ~16 ms on 60 Hz or ~8 ms on 120 Hz displays (when there is no lag)
* `elapsedTime: number`: time (in milliseconds) since the callback was last activated

## Example

```js {13-17}
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import {Button, View} from 'react-native';

import React from 'react';

export default function FrameCallbackExample() {
  const x = useSharedValue(0);

  const frameCallback = useFrameCallback((frameTime) => {
    console.log(`${frameTime.duration} ms have passed since the previous frame`);
    // Move the box by one pixel on every frame
    x.value += 1;
  }, false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        }
      ],
    };
  });

  return (
    <View>
      <Animated.View style={[styles.box, animatedStyle1]} />
      <Button title={'Start/stop'} onPress={() => frameCallback.setActive(!frameCallback.isActive)}>
    </View>
  );
}
```