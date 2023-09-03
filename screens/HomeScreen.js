import { StyleSheet, Text, View, ScrollView, Image, TouchableWithoutFeedback  } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-paper"; // Importa el FAB


const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
 
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.1.37:8000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    }
  };

  console.log("posts", posts);



  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.1.37:8000/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.1.37:8000/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      // Update the posts array with the updated post
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      console.log("updated ",updatedPosts)
    
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile", { userId: userId });
  };


  const navigateToThreadCreation = () => {
    navigation.navigate("Thread"); // Ajusta el nombre de la ruta según corresponda
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>

    <ScrollView style={{ marginTop: 50, flex: 1}}>
  
        <View style={{ alignItems: "center", marginTop: 20 }}>
           <Image
              style={{ width: 60, height: 40, resizeMode: "contain" }}
              source={{
              uri: "https://img.freepik.com/vector-premium/nuevo-logotipo-twitter-x-2023-descarga-vector-logotipo-twitter-x_691560-10809.jpg",
            }}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          {posts?.map((post) => (
            // <PostItem
            //   key={post._id}
            //   post={post}
            //   userId={userId}
            //   handleLike={handleLike}
            //   handleDislike={handleDislike}
            //   navigateToProfile={navigateToProfile}
            // />
            <View
            style={{
              padding: 15,
              borderColor: "#D0D0D0",
              borderTopWidth: 1,
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
            }}
            key={post._id}
          >
            <TouchableWithoutFeedback onPress={() => 
              navigation.navigate("ProfileUserScreen", { userId: post?.user?._id })}>
              <View>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    resizeMode: "contain",
                  }}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
              >
                {post?.user?.name}
              </Text>
              <Text>{post?.content}</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                {post?.likes?.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleDislike(post?._id)}
                    name="heart"
                    size={18}
                    color="red"
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post?._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}

                <FontAwesome name="comment-o" size={18} color="black" />

                <Ionicons name="share-social-outline" size={18} color="black" />
              </View>

              <Text style={{ marginTop: 7, color: "gray" }}>
                {post?.likes?.length} likes • {post?.replies?.length} reply
              </Text>
            </View>
          </View>
 
          ))}
        </View>

    
      </ScrollView>
      
      

      <FAB
       // style={styles.fab}
        icon="feather"
        onPress={navigateToThreadCreation}
        small // Hace que el FAB sea más pequeño
        color="white" // Cambia el color del ícono
        style={{ backgroundColor: '#00ACEE', position: 'absolute', bottom: 20, right: 20 }}  
      />
    </View>


  );
};

export default HomeScreen;

const styles = StyleSheet.create({});


const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
 
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 30, // Añade este estilo para hacer el botón redondeado

  },
  // Resto de tus definiciones de estilo
});