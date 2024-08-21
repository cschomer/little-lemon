import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Hero from "../components/Hero";
import _ from "lodash";

const Home = () => {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState("");

  const updateSearch = (search) => {
    console.log(search);
    // call search function
    setSearchText(search);
  };

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = await openDatabaseAsync("little_lemon.db");
        setDb(database);
        await createTable(database);
        await loadData(database);
      } catch (error) {
        console.error("Failed to initialize database", error);
      }
    };

    initDatabase();
  }, []);

  useEffect(() => {
    const debouncedSearch = _.debounce(() => {
      if (db) {
        searchDishes(db, searchText);
      }
    }, 500);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, db]);

  // Create the menu table if it does not exist
  const createTable = async (db: SQLiteDatabase) => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,

          price REAL,
          description TEXT,
          image TEXT
        );
      `);
      console.log("Table created successfully");
    } catch (error) {
      console.error("Failed to create table", error);
    }
  };

  // Load data from the database or fetch from the server if not available
  const loadData = async (db: SQLiteDatabase) => {
    try {
      const result = await db.getAllAsync("SELECT * FROM menu");
      if (result.length > 0) {
        console.log(result);
        setMenuItems(result);
      } else {
        await fetchMenuFromServer(db);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  // Fetch menu data from the server and insert it into the database
  const fetchMenuFromServer = async (db: SQLiteDatabase) => {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const menuData = response.data.menu;
      console.log(menuData);

      await db.withTransactionAsync(async () => {
        for (const item of menuData) {
          await db.runAsync(
            "INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?);",
            item.name,
            item.price,
            item.description,
            item.image
          );
        }
      });

      setMenuItems(menuData);
    } catch (error) {
      console.error("Failed to fetch menu data", error);
    }
  };

  const searchDishes = async (db: SQLiteDatabase, searchText: string) => {
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM menu WHERE name LIKE ?",
        [`%${searchText}%`]
      );
      setMenuItems(result);
    } catch (error) {
      console.error("Failed to search dishes", error);
    }
  };

  // Render each menu item
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (!db) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={require("../assets/profile.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      {/* Hero Section */}
      <Hero updateSearch={updateSearch} />
      {/* Menu List */}
      <View style={styles.menuContainer}>
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  logo: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuContainer: {
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
