import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { selectStudent } = useActiveStudent();

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "studentAccounts"), where("userId", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAccounts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSelect = async (acc) => {
    await selectStudent(acc);
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient colors={["#007AFF", "#5CA0FF"]} style={styles.header}>
        <Text style={styles.headerTitle}>My Accounts</Text>
        <Text style={styles.headerSubtitle}>Manage your linked student profiles</Text>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 60 }} />
        ) : accounts.length > 0 ? (
          accounts.map((acc, index) => (
            <TouchableOpacity key={acc.id} activeOpacity={0.9} style={styles.card} onPress={() => handleSelect(acc)}>
              <View style={[styles.cardAccent, { backgroundColor: index % 2 === 0 ? "#007AFF" : "#00BFA5" }]} />
              <View style={styles.cardBody}>
                <Text style={styles.name}>{acc.fullName}</Text>
                <Text style={styles.sub}>{acc.schoolId}</Text>
                <Text style={[styles.sub, { marginTop: 4 }]}>
                  Class {acc.className} • Roll {acc.rollNumber}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ marginTop: 60 }}>
            <Text style={styles.emptyTitle}>No Accounts Found</Text>
            <Text style={styles.emptySub}>Add your first student account below</Text>
          </View>
        )}
      </ScrollView>

      {/* Add New Account */}
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={() => router.push("/create-account")}>
        <LinearGradient colors={["#007AFF", "#0056D2"]} style={styles.addBtnGradient}>
          <Text style={styles.addText}>＋ Add New Account</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:"#F4F7FB"},
  header:{paddingTop:60,paddingBottom:40,paddingHorizontal:20,borderBottomLeftRadius:40,borderBottomRightRadius:40,elevation:6,shadowColor:"#007AFF",shadowOpacity:0.25,shadowRadius:10,shadowOffset:{width:0,height:4}},
  headerTitle:{fontSize:26,fontWeight:"800",color:"#fff"},
  headerSubtitle:{fontSize:14,color:"#EAF3FF",marginTop:4},
  container:{paddingHorizontal:20,paddingBottom:120,paddingTop:20},
  card:{flexDirection:"row",alignItems:"center",backgroundColor:"#fff",borderRadius:16,marginBottom:16,elevation:4,shadowColor:"#000",shadowOpacity:0.1,shadowRadius:6,shadowOffset:{width:0,height:2}},
  cardAccent:{width:8,height:"100%",borderTopLeftRadius:16,borderBottomLeftRadius:16},
  cardBody:{flex:1,paddingVertical:16,paddingHorizontal:18},
  name:{fontSize:17,fontWeight:"700",color:"#1A1A1A"},
  sub:{fontSize:13,color:"#666"},
  addBtn:{position:"absolute",bottom:30,left:0,right:0,alignItems:"center"},
  addBtnGradient:{paddingVertical:16,paddingHorizontal:32,borderRadius:30,shadowColor:"#007AFF",shadowOpacity:0.4,shadowRadius:6,shadowOffset:{width:0,height:3}},
  addText:{color:"#fff",fontWeight:"700",fontSize:16},
  emptyTitle:{textAlign:"center",fontSize:18,fontWeight:"700",color:"#333"},
  emptySub:{textAlign:"center",fontSize:14,color:"#777",marginTop:6},
});
