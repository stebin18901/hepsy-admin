import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";

const { width } = Dimensions.get('window');

export default function CreateTeamScreen() {
  const { activeStudent } = useActiveStudent();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert("Error", "Please enter a team name");
      return;
    }

    if (!activeStudent) {
      Alert.alert("Error", "No student selected");
      return;
    }

    setIsCreating(true);

    try {
      const teamsRef = collection(db, "teams");
      const q = query(teamsRef, where("name", "==", teamName.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Error", "Team name already exists. Please choose another name.");
        return;
      }

      const newTeam = {
        name: teamName.trim(),
        description: teamDescription.trim(),
        createdBy: activeStudent.id,
        createdByName: activeStudent.name,
        className: activeStudent.className,
        members: [{
          studentId: activeStudent.id,
          studentName: activeStudent.name,
          role: "admin",
          joinedAt: new Date()
        }],
        createdAt: new Date(),
        memberCount: 1,
        maxMembers: 10,
        isPublic: true,
        pendingInvites: []
      };

      await addDoc(teamsRef, newTeam);
      
      Alert.alert("Success", "Team created successfully!", [
        { 
          text: "OK", 
          onPress: () => router.back() 
        }
      ]);
    } catch (error) {
      console.error("Error creating team:", error);
      Alert.alert("Error", "Failed to create team. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const availableQuizzes = [
    { 
      id: "1", 
      title: "MATHEMATICS CHALLENGE", 
      subject: "MATH", 
      participants: 15, 
      maxTeams: 8,
      difficulty: "PRO",
      time: "30 MIN",
      prize: "500 XP",
      color: "#FF6B35"
    },
    { 
      id: "2", 
      title: "SCIENCE OLYMPIAD", 
      subject: "SCIENCE", 
      participants: 23, 
      maxTeams: 10,
      difficulty: "LEGEND",
      time: "45 MIN",
      prize: "750 XP",
      color: "#00A8FF"
    },
    { 
      id: "3", 
      title: "ENGLISH LITERATURE", 
      subject: "ENGLISH", 
      participants: 8, 
      maxTeams: 6,
      difficulty: "WORLD CLASS",
      time: "25 MIN",
      prize: "400 XP",
      color: "#9C27B0"
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'PRO': return '#FF6B35';
      case 'LEGEND': return '#00A8FF';
      case 'WORLD CLASS': return '#9C27B0';
      default: return '#4CAF50';
    }
  };

  return (
    <View style={styles.screen}>
      {/* FIFA-style Background with Light Theme */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternLine} />
        <View style={[styles.patternLine, { top: 100 }]} />
        <View style={[styles.patternLine, { top: 200 }]} />
        <View style={[styles.patternLine, { top: 300 }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FIFA-style Header - Light Theme */}
        <LinearGradient
          colors={["#FFFFFF", "#F8F9FA", "#E3F2FD"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerSubtitle}>ACADEMIC SQUADS</Text>
              <Text style={styles.headerTitle}>TEAM ARENA</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.badgeText}>v2.4</Text>
            </View>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>ACTIVE TEAMS</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>PLAYERS ONLINE</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>LIVE MATCHES</Text>
            </View>
          </View>
        </LinearGradient>

        {/* FIFA-style Tab Navigation - Light Theme */}
        <View style={styles.tabContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.tab,
              activeTab === "create" && styles.activeTab,
              pressed && styles.tabPressed
            ]}
            onPress={() => setActiveTab("create")}
          >
            <LinearGradient
              colors={activeTab === "create" ? ["#FF6B35", "#FF8E53"] : ["transparent", "transparent"]}
              style={styles.tabGradient}
            >
              <Text style={[
                styles.tabText,
                activeTab === "create" && styles.activeTabText
              ]}>
                🚀 CREATE SQUAD
              </Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.tab,
              activeTab === "join" && styles.activeTab,
              pressed && styles.tabPressed
            ]}
            onPress={() => setActiveTab("join")}
          >
            <LinearGradient
              colors={activeTab === "join" ? ["#00A8FF", "#4FC3F7"] : ["transparent", "transparent"]}
              style={styles.tabGradient}
            >
              <Text style={[
                styles.tabText,
                activeTab === "join" && styles.activeTabText
              ]}>
                ⚔️ COMPETITIONS
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Create Team Section - FIFA Card Style Light */}
        {activeTab === "create" && (
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={["#FF6B35", "#FF8E53"]}
              style={styles.cardHeader}
            >
              <Text style={styles.cardTitle}>CREATE NEW SQUAD</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>CAPTAIN</Text>
              </View>
            </LinearGradient>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>SQUAD NAME</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={teamName}
                    onChangeText={setTeamName}
                    placeholder="ENTER YOUR SQUAD NAME..."
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>SQUAD MOTTO</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={teamDescription}
                    onChangeText={setTeamDescription}
                    placeholder="WHAT'S YOUR TEAM'S BATTLE CRY?..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.buttonPressed,
                  isCreating && styles.disabledButton
                ]}
                onPress={handleCreateTeam}
                disabled={isCreating}
              >
                <LinearGradient
                  colors={["#4CAF50", "#66BB6A", "#81C784"]}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isCreating ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.createButtonText}>CONFIRM SQUAD</Text>
                      <Text style={styles.createButtonSubtext}>READY FOR BATTLE!</Text>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        )}

        {/* Join Quizzes Section - FIFA Tournament Style Light */}
        {activeTab === "join" && (
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={["#00A8FF", "#4FC3F7"]}
              style={styles.cardHeader}
            >
              <View style={styles.cardHeaderContent}>
                <Text style={styles.cardTitle}>LIVE COMPETITIONS</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.tournamentList}>
              {availableQuizzes.map((quiz, index) => (
                <Pressable
                  key={quiz.id}
                  style={({ pressed }) => [
                    styles.tournamentCard,
                    pressed && styles.tournamentCardPressed
                  ]}
                  onPress={() => Alert.alert("Join Tournament", `Join ${quiz.title}?`)}
                >
                  <LinearGradient
                    colors={["#FFFFFF", "#F8F9FA", "#FFFFFF"]}
                    style={styles.tournamentGradient}
                  >
                    {/* Tournament Header */}
                    <View style={styles.tournamentHeader}>
                      <View style={styles.tournamentTitleContainer}>
                        <Text style={styles.tournamentTitle}>{quiz.title}</Text>
                        <View style={[styles.difficultyBadge, { backgroundColor: quiz.color }]}>
                          <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
                        </View>
                      </View>
                      <Text style={[styles.tournamentSubject, { backgroundColor: quiz.color }]}>
                        {quiz.subject}
                      </Text>
                    </View>

                    {/* Tournament Stats */}
                    <View style={styles.tournamentStats}>
                      <View style={styles.statRow}>
                        <View style={styles.stat}>
                          <Text style={styles.statIcon}>⏱️</Text>
                          <Text style={styles.statValue}>{quiz.time}</Text>
                        </View>
                        <View style={styles.stat}>
                          <Text style={styles.statIcon}>👥</Text>
                          <Text style={styles.statValue}>{quiz.participants}</Text>
                        </View>
                        <View style={styles.stat}>
                          <Text style={styles.statIcon}>🏆</Text>
                          <Text style={styles.statValue}>{quiz.maxTeams}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Prize Pool */}
                    <View style={styles.prizeContainer}>
                      <Text style={styles.prizeLabel}>PRIZE POOL</Text>
                      <Text style={styles.prizeValue}>{quiz.prize}</Text>
                    </View>

                    {/* Join Button */}
                    <LinearGradient
                      colors={[quiz.color, `${quiz.color}DD`]}
                      style={styles.joinTournamentButton}
                    >
                      <Text style={styles.joinTournamentText}>ENTER TOURNAMENT →</Text>
                    </LinearGradient>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Features Section - FIFA Stats Style Light */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>WHY BUILD YOUR SQUAD?</Text>
          <View style={styles.featuresGrid}>
            {[
              { icon: "⚡", title: "TEAM CHEMISTRY", desc: "Boost performance with perfect collaboration", color: "#FF6B35" },
              { icon: "🎯", title: "COMPETITIVE MODE", desc: "Climb the leaderboards together", color: "#00A8FF" },
              { icon: "🌟", title: "XP REWARDS", desc: "Earn exclusive rewards and badges", color: "#9C27B0" },
              { icon: "📊", title: "PERFORMANCE STATS", desc: "Track your team's progress", color: "#4CAF50" }
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>READY FOR THE CHALLENGE? JOIN THE ARENA! 🏟️</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  patternLine: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: '#00A8FF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1a237e",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 5,
  },
  headerBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: "#FF6B35",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: '700',
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  activeTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  tabPressed: {
    transform: [{ scale: 0.96 }],
  },
  tabText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#666",
    letterSpacing: 1,
  },
  activeTabText: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 20,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardBadgeText: {
    color: '#FF6B35',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FF4444',
    borderRadius: 4,
  },
  liveText: {
    color: '#FF4444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6B35",
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#E3F2FD',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  gradientButton: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  buttonContent: {
    alignItems: 'center',
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  createButtonSubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 4,
  },
  tournamentList: {
    gap: 16,
    padding: 20,
  },
  tournamentCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  tournamentCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  tournamentGradient: {
    padding: 20,
  },
  tournamentHeader: {
    marginBottom: 16,
  },
  tournamentTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1a237e",
    flex: 1,
    marginRight: 12,
    letterSpacing: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  difficultyText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tournamentSubject: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    letterSpacing: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tournamentStats: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 12,
    color: "#666",
    fontWeight: "700",
    letterSpacing: 1,
  },
  prizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#F0F0F0',
  },
  prizeLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "700",
    letterSpacing: 1,
  },
  prizeValue: {
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "900",
    letterSpacing: 1,
  },
  joinTournamentButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  joinTournamentText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1a237e",
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#F8F9FA',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1a237e",
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  featureDescription: {
    fontSize: 9,
    color: "#666",
    textAlign: 'center',
    lineHeight: 12,
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: '#1a237e',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
});