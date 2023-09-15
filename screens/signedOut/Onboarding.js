import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS } from "../../constants";
import {
  ChatBoxIcon,
  PharmacyNearIcon,
  RefillIcon,
} from "../../constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../../context/AppContext";

const data = [
  {
    title: "Prescription refill.",
    desc: "Get a prescription refill from the nearby pharmacies.",
    image: RefillIcon,
  },
  {
    title: "Live chat.",
    desc: "Talk to pharmacies live and request anything about your prescription.",
    image: ChatBoxIcon,
  },
  {
    title: "Nearby pharmacies.",
    desc: "Get suggested to the nearby pharmacies.",
    image: PharmacyNearIcon,
  },
];

const width = Dimensions.get("window").width;

const Onboarding = ({ navigation }) => {
  const [active, setActive] = useState(0);
  const { setLaunched } = useAppContext();

  const handlePress = async () => {
    await AsyncStorage.setItem("launched", "yes")
      .then(() => {
        setLaunched(true);
        navigation.navigate("Bottom");
      })
      .catch((error) => console.log(error));
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ width, padding: 10 }}>
        <View style={styles.flexView}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.flexView}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(e) => {
          const scrollX = e.nativeEvent.contentOffset.x;
          const index = Math.floor(scrollX / width);
          setActive(index);
        }}
      />
      <View style={styles.indicators}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              {
                backgroundColor: active === i ? COLORS.red : "#ccc",
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.button}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  image: {
    height: width * 0.4,
    width: width * 0.4,
  },
  title: {
    ...FONTS.SemiBold,
    fontSize: 30,
    textAlign: "center",
  },
  flexView: { flex: 1, justifyContent: "center", alignItems: "center" },
  desc: {
    ...FONTS.Regular,
    fontSize: 14,
    color: COLORS.ltblack,
    textAlign: "center",
    marginTop: 10,
  },
  indicators: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    marginVertical: 30,
  },
  indicator: {
    width: 10,
    height: 5,
    borderRadius: 5,
  },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.SemiBold,
    fontSize: 16,
  },
});
