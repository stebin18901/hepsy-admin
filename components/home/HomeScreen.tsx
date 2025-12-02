import React, { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import HeaderCard from "./HeaderCard";
import StudentSwitcher from "./StudentSwitcher";
import StatsRow from "./StatsRow";
import SectionHeading from "./SectionHeading";
import PerformanceChart from "./PerformanceChart";
import QuickActions from "./QuickActions";
import GrowthTrend from "./GrowthTrend";
import WeakAreas from "./WeakAreas";
import AchievementsCarousel from "./AchievementsCarousel";
import UpcomingAssessments from "./UpcomingAssessments";
import Announcements from "./Announcements";

const MOCK_STUDENT = {
  id: "1",
  fullName: "Sarah Johnson",
  grade: "Grade 7",
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState(MOCK_STUDENT);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <View style={styles.container}>
      <HeaderCard />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StudentSwitcher student={student} onPress={() => {}} />
        <StatsRow />
        
        <SectionHeading title="Performance Overview" />
        <PerformanceChart />
        <GrowthTrend />
        
        <SectionHeading title="Quick Access" />
        <QuickActions />
        
        <SectionHeading title="Learning Progress" />
        <WeakAreas />
        
        <SectionHeading title="Celebrating Success" />
        <AchievementsCarousel />
        
        <SectionHeading title="What's Next" />
        <UpcomingAssessments />
        
        <SectionHeading title="School Updates" />
        <Announcements />
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  spacer: {
    height: 40,
  },
});