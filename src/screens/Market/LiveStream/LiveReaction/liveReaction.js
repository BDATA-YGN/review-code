// import React, {useRef, useState, useEffect} from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import IconManager from '../../../../assets/IconManager';
// import SPACING from '../../../../constants/SPACING';

// const LiveReaction = () => {
//   const [reactions, setReactions] = useState([]);
//   const reactionCounter = useRef(0);
//   const timerRef = useRef(null);

//   const handlePress = () => {
//     setReactions(prevReactions => [
//       ...prevReactions,
//       {id: reactionCounter.current++},
//     ]);

//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       setReactions([]);
//     }, 3000);
//   };

//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.reactionStyle} onPress={handlePress}>
//         <Image
//           source={IconManager.loveReactLine}
//           style={styles.iconStyle}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>

//       {reactions.map(reaction => (
//         <FloatingReaction key={reaction.id} />
//       ))}
//     </View>
//   );
// };

// // Component for each animated floating reaction with heartbeat effect
// const FloatingReaction = () => {
//   const animatedValue = useRef(new Animated.Value(0)).current;
//   const opacity = useRef(new Animated.Value(1)).current;
//   const scale = useRef(new Animated.Value(1)).current;

//   // Heartbeat and floating animation sequence
//   Animated.parallel([
//     Animated.sequence([
//       Animated.spring(scale, {
//         toValue: 1.5, // Scale up to 1.5 for heartbeat
//         friction: 2, // Control the bounce effect
//         useNativeDriver: true,
//       }),
//       Animated.spring(scale, {
//         toValue: 1, // Scale back to normal
//         friction: 2,
//         useNativeDriver: true,
//       }),
//     ]),
//     Animated.timing(animatedValue, {
//       toValue: -600,
//       duration: 2000,
//       useNativeDriver: true,
//     }),
//     Animated.timing(opacity, {
//       toValue: 0,
//       duration: 2000,
//       useNativeDriver: true,
//     }),
//   ]).start();

//   return (
//     <Animated.View
//       style={[
//         styles.floatingReaction,
//         {
//           transform: [
//             {translateY: animatedValue},
//             {scale: scale}, // Apply heartbeat scale transformation
//           ],
//           opacity,
//         },
//       ]}>
//       <Image
//         source={IconManager.loveReactLine}
//         style={styles.iconStyle}
//         resizeMode="contain"
//       />
//     </Animated.View>
//   );
// };

// export default LiveReaction;

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//   },
//   reactionStyle: {
//     borderRadius: SPACING.sp8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingLeft: 8,
//     zIndex: 1,
//   },
//   floatingReaction: {
//     position: 'absolute',
//     bottom: 0,
//   },
//   iconStyle: {
//     width: 40,
//     height: 40,
//   },
// });

// import React, {useRef} from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import IconManager from '../../../../assets/IconManager';
// import SPACING from '../../../../constants/SPACING';

// const LiveReaction = () => {
//   const scale = useRef(new Animated.Value(1)).current; // Initial scale
//   const animatedValue = useRef(new Animated.Value(0)).current; // Initial position for floating
//   const opacity = useRef(new Animated.Value(1)).current; // Initial opacity

//   const triggerAnimation = () => {
//     // Reset animations to initial values
//     scale.setValue(1);
//     animatedValue.setValue(0);
//     opacity.setValue(1);

//     // Start heartbeat and floating animations
//     Animated.parallel([
//       Animated.sequence([
//         Animated.spring(scale, {
//           toValue: 1.5,
//           friction: 2,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scale, {
//           toValue: 1,
//           friction: 2,
//           useNativeDriver: true,
//         }),
//       ]),
//       Animated.timing(animatedValue, {
//         toValue: -600,
//         duration: 2000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(opacity, {
//         toValue: 0,
//         duration: 2000,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   return (
//     <View style={styles.container}>
//       {/* Original Button */}
//       <TouchableOpacity style={styles.reactionStyle} onPress={triggerAnimation}>
//         <Image
//           source={IconManager.loveReactLine}
//           style={styles.iconStyle}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>

//       {/* Animated Floating Reaction */}
//       <Animated.View
//         style={[
//           styles.floatingReaction,
//           {
//             transform: [{translateY: animatedValue}, {scale: scale}],
//             opacity,
//           },
//         ]}>
//         <Image
//           source={IconManager.loveReactLine}
//           style={styles.iconStyle}
//           resizeMode="contain"
//         />
//       </Animated.View>
//     </View>
//   );
// };

// export default LiveReaction;

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//   },
//   reactionStyle: {
//     borderRadius: SPACING.sp8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingLeft: 8,
//     zIndex: 1,
//   },
//   floatingReaction: {
//     position: 'absolute',
//     bottom: 60, // Position the floating icon above the button
//     right: 135,
//   },
//   iconStyle: {
//     width: 40,
//     height: 40,
//   },
// });

import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import IconManager from '../../../../assets/IconManager';
import SPACING from '../../../../constants/SPACING';

const LiveReaction = () => {
  const scale = useRef(new Animated.Value(1)).current; // Initial scale
  const animatedValue = useRef(new Animated.Value(0)).current; // Initial position for floating
  const opacity = useRef(new Animated.Value(0)).current; // Initial opacity set to 0

  const triggerAnimation = () => {
    // Reset animations to initial values
    scale.setValue(1);
    animatedValue.setValue(0);
    opacity.setValue(1); // Set opacity to 1 when animation starts

    // Start heartbeat and floating animations
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.5,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 2,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(animatedValue, {
        toValue: -600,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, // Fade out over the duration of the animation
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Original Button */}
      <TouchableOpacity style={styles.reactionStyle} onPress={triggerAnimation}>
        <Image
          source={IconManager.loveReactLine}
          style={styles.iconStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Animated Floating Reaction */}
      <Animated.View
        style={[
          styles.floatingReaction,
          {
            transform: [{translateY: animatedValue}, {scale: scale}],
            opacity, // Control visibility with opacity
          },
        ]}>
        <Image
          source={IconManager.loveReactLine}
          style={styles.iconStyle}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default LiveReaction;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  reactionStyle: {
    borderRadius: SPACING.sp8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    zIndex: 1,
  },
  floatingReaction: {
    position: 'absolute',
    bottom: 60, // Position the floating icon above the button
    right: 135,
  },
  iconStyle: {
    width: 40,
    height: 40,
  },
});
