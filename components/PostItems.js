// PostItem.js
import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

const PostItem = ({ post, userId, handleLike, handleDislike, navigateToProfile }) => (
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
        navigation.navigate("Profile", { userId: post?.user?._id })}>
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
);

export default PostItem;
