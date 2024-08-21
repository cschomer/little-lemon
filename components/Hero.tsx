import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
interface HeroProps {
  updateSearch: (value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ updateSearch }) => {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Chicago</Text>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={require("../assets/heroImage.png")}
          style={styles.heroImage}
        />
      </View>
      <View style={styles.iconContainer}>
        {searchVisible && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes..."
            placeholderTextColor="#888"
            onChangeText={updateSearch}
          />
        )}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setSearchVisible(!searchVisible)}
        >
          <Ionicons name="search" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#495E57",
    padding: 16,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F4CE14",
  },
  subtitle: {
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 15,
    marginBottom: 15,
  },
  heroImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginLeft: 16,
  },
  icon: {
    alignSelf: "flex-start",
    marginTop: 16,
  },
  iconContainer: {
    alignSelf: "stretch",
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
  },
  searchInput: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
    color: "black",
  },
});

export default Hero;
