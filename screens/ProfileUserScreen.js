import { StyleSheet, Text, View, Image, Pressable, FlatList, Modal  } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute  } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";


const ProfileUserScreen = ({ route }) => {
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation()
  const { userId: profileUserId } = route.params;
  const { userId, setUserId } = useContext(UserType);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const openDeleteModal = (postId) => {
    setSelectedPostId(postId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedPostId(null);
    setShowDeleteModal(false);
  };



useEffect(() => {
  const fetchProfile = async () => {
    try {
 
      const profileResponse = await axios.get(
        `http://192.168.1.37:8000/profile/${profileUserId}`  
      );
      const postsResponse = await axios.get(
        `http://192.168.1.37:8000/user-posts/${profileUserId}` 
      );

      const { user } = profileResponse.data;
      const userPosts = postsResponse.data;

      setUser(user);
      setUserPosts(userPosts);
    } catch (error) {
      console.log("error", error);
    }
  };

  fetchProfile();
}, [profileUserId]);


  const logout = () => {
      clearAuthToken();
  }
  const clearAuthToken = async () => {
      await AsyncStorage.removeItem("authToken");
      console.log("Cleared auth token");
      navigation.replace("Login")
  }




  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://192.168.1.37:8000/posts/${postId}`);
      const updatedPosts = userPosts.filter((post) => post._id !== postId);
      setUserPosts(updatedPosts);
      closeDeleteModal();
    } catch (error) {
      console.log("Error deleting post", error);
    }
  };

 
  const isOwnProfile = user?._id === userId; 

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>

       
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Threads.net</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>BTech.</Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Movie Buff | Musical Nerd
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Love Yourself
            </Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {user?.followers?.length} followers
        </Text>
        <View style={{flexDirection:"row",alignItems:"center",gap:10,marginTop:20}}>

        {isOwnProfile && (
          <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderRadius: 5,
          }}
        >
          <Text>Edit Profile</Text>
        </Pressable>
          )}



          {isOwnProfile && (
            <Pressable
              onPress={logout}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <Text>Logout</Text>
            </Pressable>
          )}

        </View>
      </View>



      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Posts</Text>

        <FlatList
          data={userPosts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postContainer} key={item._id}>
               <View style={styles.profileImageContainer}>
                <Image
                   style={styles.profileImage}
                   source={{
                     uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                   }}
                />
              </View>
 
      <View style={styles.postContentContainer}>
        {/* <Text style={styles.userName}>{item?.user?.name}</Text> */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{item?.user?.name}</Text>
          <Pressable style={styles.moreButtonContainer} onPress={() => openDeleteModal(item._id)}>
            <Text style={styles.moreButton}>...</Text>
          </Pressable>
        </View>
        
        <Text style={styles.postText}>{item?.content}</Text>

        <View style={styles.iconContainer}>
        {/* <AntDesign
            onPress={() => handleLike(item?._id)}
            name={post?.likes?.includes(userId) ? "heart" : "hearto"}
            size={18}
            color={post?.likes?.includes(userId) ? "red" : "black"}
          /> */}
          <FontAwesome name="comment-o" size={18} color="black" />
          <Ionicons name="share-social-outline" size={18} color="black" />
        </View>

        <Text style={styles.likesAndReplies}>
          {item?.likes?.length} likes • {item?.replies?.length} reply
        </Text>
      </View>
    </View>
  )}
/>
      </View>

            {/* Modal para eliminar posts */}
    <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDeleteModal}
      >
     <View style={styles.modalContainer}>
       <View style={styles.modalContent}>
          <Text>¿Eliminar este post?</Text>
             <Pressable style={styles.modalButton} onPress={closeDeleteModal}>
               <Text>Cancelar</Text>
             </Pressable>
             <Pressable style={styles.modalButton} onPress={() => handleDeletePost(selectedPostId)}>
               <Text style={{ color: "red" }}>Eliminar</Text>
             </Pressable>
          </View>
        </View>
     </Modal>
    </View>
  );
};

export default ProfileUserScreen;

//const styles = StyleSheet.create({});

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    borderColor: "#D0D0D0",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  profileImageContainer: {
    // Estilos para el contenedor de la imagen de perfil
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  postContentContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  postText: {
    // Estilos para el texto del post
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  likesAndReplies: {
    marginTop: 7,
    color: "gray",
  },
  // Otros estilos que puedas necesitar

  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreButtonContainer: {
    padding: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 5,
  },
  moreButton: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#D0D0D0",
  },
  deleteButton: {
    backgroundColor: "red",
  },
});
