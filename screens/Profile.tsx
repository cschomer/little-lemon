import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import MaskInput from "react-native-mask-input";

const Profile = ({ navigation }) => {
  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [orderStatuses, setOrderStatuses] = useState(true);
  const [passwordChanges, setPasswordChanges] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  // Load profile data from disk
  const loadProfileData = async () => {
    const storedFirstName = await SecureStore.getItemAsync("firstName");
    const storedLastName = await SecureStore.getItemAsync("lastName");
    const storedEmail = await SecureStore.getItemAsync("email");
    const storedPhoneNumber = await SecureStore.getItemAsync("phoneNumber");
    const storedAvatar = await SecureStore.getItemAsync("avatar");

    setFirstName(storedFirstName || "");
    setLastName(storedLastName || "");
    setEmail(storedEmail || "");
    setPhoneNumber(storedPhoneNumber || "");
    setAvatar(storedAvatar || null);
  };

  // Save profile data to disk
  const saveProfileData = async () => {
    await SecureStore.setItemAsync("firstName", firstName);
    await SecureStore.setItemAsync("lastName", lastName);
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("phoneNumber", phoneNumber);
    avatar !== null && (await SecureStore.setItemAsync("avatar", avatar));
    Alert.alert("Profile saved!", "Your changes have been saved successfully.");
  };

  // Logout and clear data
  const logout = async () => {
    // Logout and clear data
    await SecureStore.deleteItemAsync("firstName");
    await SecureStore.deleteItemAsync("lastName");
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("phoneNumber");
    await SecureStore.deleteItemAsync("avatar");
    navigation.navigate("Onboarding");
  };

  // Handle image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {avatar ? (
          <Image style={styles.avatar} source={{ uri: avatar }} />
        ) : (
          <View style={styles.initialsAvatar}>
            <Text style={styles.initialsText}>
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => setAvatar(null)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone number</Text>
        <MaskInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(masked, unmasked) => setPhoneNumber(unmasked)}
          mask={[
            "(",
            /\d/,
            /\d/,
            /\d/,
            ")",
            " ",
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Email notifications</Text>
      <View style={styles.switchGroup}>
        <View style={styles.switchRow}>
          <Switch value={orderStatuses} onValueChange={setOrderStatuses} />
          <Text style={styles.switchLabel}>Order statuses</Text>
        </View>
        <View style={styles.switchRow}>
          <Switch value={passwordChanges} onValueChange={setPasswordChanges} />
          <Text style={styles.switchLabel}>Password changes</Text>
        </View>
        <View style={styles.switchRow}>
          <Switch value={specialOffers} onValueChange={setSpecialOffers} />
          <Text style={styles.switchLabel}>Special offers</Text>
        </View>
        <View style={styles.switchRow}>
          <Switch value={newsletter} onValueChange={setNewsletter} />
          <Text style={styles.switchLabel}>Newsletter</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.discardButton}
          onPress={loadProfileData}
        >
          <Text style={styles.discardText}>Discard changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveProfileData}>
          <Text style={styles.saveText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  initialsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initialsText: {
    fontSize: 30,
    color: "#fff",
  },
  changeButton: {
    backgroundColor: "#495E57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  changeText: {
    color: "#fff",
  },
  removeButton: {
    borderWidth: 1,
    borderColor: "#495E57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  removeText: {
    color: "#495E57",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  switchGroup: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#F4CE14",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discardButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  discardText: {
    color: "#495E57",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#495E57",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Profile;
