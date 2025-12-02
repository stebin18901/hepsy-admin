import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Post {
  id: string;
  name: string;
  avatar: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
}

export default function ParentSocialPage() {
  const [newPost, setNewPost] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const scrollY = useRef(new Animated.Value(0)).current;

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "The annual day performance was absolutely breathtaking! So proud of all our children 🎭",
      image: "https://images.unsplash.com/photo-1533228100845-08145b01de14?w=400&h=300&fit=crop",
      likes: 34,
      comments: 4,
      time: "2h ago"
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "Does anyone have the schedule for next week's parent-teacher meetings?",
      likes: 12,
      comments: 2,
      time: "4h ago"
    },
  ]);

  const groups = ["All", "Grade 1", "Grade 2", "Sports", "Events", "Announcements"];

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    
    const newEntry: Post = {
      id: Date.now().toString(),
      name: "You",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: newPost,
      likes: 0,
      comments: 0,
      time: "Just now"
    };
    
    setPosts([newEntry, ...posts]);
    setNewPost("");
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Fixed Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>ParentConnect</Text>
            <Text style={styles.headerSubtitle}>Community</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>🔔</Text>
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Search posts, events, parents..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.quickActionEmoji}>📚</Text>
              </View>
              <Text style={styles.quickActionText}>Homework</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.quickActionEmoji}>🎉</Text>
              </View>
              <Text style={styles.quickActionText}>Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3F2' }]}>
                <Text style={styles.quickActionEmoji}>🚗</Text>
              </View>
              <Text style={styles.quickActionText}>Carpool</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F0F9FF' }]}>
                <Text style={styles.quickActionEmoji}>💼</Text>
              </View>
              <Text style={styles.quickActionText}>Market</Text>
            </TouchableOpacity>
          </View>

          {/* Groups Filter */}
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.groupsContainer}
            >
              {groups.map((group) => (
                <TouchableOpacity
                  key={group}
                  onPress={() => setActiveGroup(group)}
                  style={[
                    styles.groupChip,
                    activeGroup === group && styles.groupChipActive
                  ]}
                >
                  <Text style={[
                    styles.groupChipText,
                    activeGroup === group && styles.groupChipTextActive
                  ]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Announcement Card */}
          <View style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <View style={styles.announcementIcon}>
                <Text style={styles.announcementEmoji}>📢</Text>
              </View>
              <View>
                <Text style={styles.announcementTitle}>School Announcement</Text>
                <Text style={styles.announcementTime}>Posted 1 hour ago</Text>
              </View>
            </View>
            <Text style={styles.announcementText}>
              School will remain closed this Friday for maintenance work. Classes will resume on Monday.
            </Text>
          </View>

          {/* Create Post */}
          <View style={styles.createPostCard}>
            <View style={styles.createPostHeader}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" }}
                style={styles.userAvatar}
              />
              <TextInput
                value={newPost}
                onChangeText={setNewPost}
                placeholder="Share something with parents..."
                placeholderTextColor="#94A3B8"
                style={styles.postInput}
                multiline
              />
            </View>
            
            <View style={styles.createPostActions}>
              <View style={styles.mediaButtons}>
                <TouchableOpacity style={styles.mediaButton}>
                  <Text style={styles.mediaIcon}>🖼️</Text>
                  <Text style={styles.mediaText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton}>
                  <Text style={styles.mediaIcon}>📅</Text>
                  <Text style={styles.mediaText}>Event</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.postButton,
                  !newPost.trim() && styles.postButtonDisabled
                ]}
                onPress={handleAddPost}
                disabled={!newPost.trim()}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Posts Feed */}
          <View style={styles.feedSection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.avatar }} style={styles.avatar} />
                  <View style={styles.userInfo}>
                    <Text style={styles.name}>{post.name}</Text>
                    <Text style={styles.time}>{post.time}</Text>
                  </View>
                  <TouchableOpacity style={styles.menuButton}>
                    <View style={styles.menuDot} />
                    <View style={styles.menuDot} />
                    <View style={styles.menuDot} />
                  </TouchableOpacity>
                </View>

                {/* Post Content */}
                <Text style={styles.postText}>{post.text}</Text>

                {post.image && (
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                )}

                {/* Post Stats */}
                <View style={styles.postStats}>
                  <Text style={styles.statText}>{post.likes} likes</Text>
                  <Text style={styles.statText}>•</Text>
                  <Text style={styles.statText}>{post.comments} comments</Text>
                </View>

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.postAction}>
                    <Text style={styles.actionIcon}>❤️</Text>
                    <Text style={styles.actionText}>Like</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.postAction}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>Comment</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.postAction}>
                    <Text style={styles.actionIcon}>🔄</Text>
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Marketplace */}
          <View style={styles.marketplaceSection}>
            <Text style={styles.sectionTitle}>Parent Marketplace</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.marketplaceContainer}
            >
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.marketItem}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=150&fit=crop",
                    }}
                    style={styles.marketImage}
                  />
                  <View style={styles.marketInfo}>
                    <Text style={styles.marketTitle}>Textbooks Grade {item}</Text>
                    <Text style={styles.marketPrice}>${20 + item * 5}</Text>
                    <Text style={styles.marketSeller}>By Parent {item}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 120, // Space for fixed header
  },

  // Header Styles
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#6366F1",
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    color: 'white',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#6366F1',
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },

  // Section Styles
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  // Groups Filter
  groupsContainer: {
    paddingHorizontal: 16,
  },
  groupChip: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  groupChipActive: {
    backgroundColor: '#6366F1',
  },
  groupChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  groupChipTextActive: {
    color: 'white',
  },

  // Announcement Card
  announcementCard: {
    backgroundColor: '#6366F1',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementEmoji: {
    fontSize: 18,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  announcementTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  announcementText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    opacity: 0.9,
  },

  // Create Post
  createPostCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 15,
    color: '#1E293B',
    maxHeight: 100,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  mediaIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  mediaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  postButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
    elevation: 2,
  },
  postButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  postButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },

  // Posts Feed
  feedSection: {
    marginBottom: 24,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  time: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  menuButton: {
    padding: 8,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 2,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginRight: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  // Marketplace
  marketplaceSection: {
    marginBottom: 24,
  },
  marketplaceContainer: {
    paddingHorizontal: 16,
  },
  marketItem: {
    width: 160,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  marketImage: {
    width: '100%',
    height: 120,
  },
  marketInfo: {
    padding: 12,
  },
  marketTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 2,
  },
  marketSeller: {
    fontSize: 12,
    color: '#64748B',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
  },

  // Spacing
  bottomSpacer: {
    height: 100,
  },
});