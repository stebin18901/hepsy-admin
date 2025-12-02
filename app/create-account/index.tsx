import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { doc, getDoc, getDocs, collection, query, where, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateAccount() {
  const [fullName, setFullName] = useState(""); const [schoolId, setSchoolId] = useState(""); const [verified, setVerified] = useState(false);
  const [classList, setClassList] = useState([]); const [selectedClass, setSelectedClass] = useState(""); const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false); const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const verifySchoolId = async () => {
    if (!schoolId.trim()) return Alert.alert("Missing Info", "Please enter a school ID to verify.");
    setVerifying(true);
    try {
      const snap = await getDoc(doc(db, "schools", schoolId.trim()));
      if (!snap.exists()) { setVerified(false); Alert.alert("Invalid School ID", "No school found with this ID."); }
      else {
        setVerified(true);
        const q = query(collection(db, "classes"), where("schoolId", "==", schoolId));
        const classSnap = await getDocs(q);
        setClassList(classSnap.docs.map((d) => d.data().className));
        Alert.alert("Success", "School ID verified!");
      }
    } catch (err) { console.error(err); Alert.alert("Error", "Verification failed."); }
    finally { setVerifying(false); }
  };

  const handleCreate = async () => {
    if (!fullName || !schoolId || !selectedClass || !rollNumber) return Alert.alert("Incomplete", "Please fill in all fields.");
    if (!verified) return Alert.alert("Unverified", "Please verify your school ID first.");
    setLoading(true);
    try {
      const classId = `${schoolId}_${selectedClass}`;
      const rollRef = doc(db, "classes", classId, "students", rollNumber);
      const rollSnap = await getDoc(rollRef);
      if (!rollSnap.exists()) return Alert.alert("Invalid Roll", "Roll number not found in class.");

      const accId = `${auth.currentUser.uid}_${schoolId}_${selectedClass}_${rollNumber}`;
      await setDoc(doc(db, "studentAccounts", accId), {
        id: accId, userId: auth.currentUser.uid, fullName, schoolId, className: selectedClass, rollNumber, createdAt: new Date(),
      });

      Alert.alert("Success", "Student account created successfully!");
      router.replace("/accounts");
    } catch (err) {
      console.error("Create account error:", err);
      Alert.alert("Error", "Could not create account. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <LinearGradient colors={["#A0C4FF", "#CDE8FF"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Student Account 🧑‍🎓</Text>
          <Text style={styles.subtitle}>Link your profile with your school and class</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Enter full name" value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>School ID</Text>
          <View style={styles.row}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Enter School ID" value={schoolId} onChangeText={setSchoolId} />
            <TouchableOpacity style={[styles.verifyBtn, verified && { backgroundColor: "#2E7D32" }]} onPress={verifySchoolId} disabled={verifying}>
              {verifying ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.verifyText}>{verified ? "Verified" : "Verify"}</Text>}
            </TouchableOpacity>
          </View>

          {verified && (
            <>
              <Text style={styles.label}>Select Class</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {classList.length > 0 ? classList.map((cls) => (
                  <TouchableOpacity key={cls} activeOpacity={0.8} style={[styles.classBtn, selectedClass === cls && styles.classBtnActive]} onPress={() => setSelectedClass(cls)}>
                    <Text style={{ color: selectedClass === cls ? "#fff" : "#333", fontWeight: "500" }}>{cls}</Text>
                  </TouchableOpacity>
                )) : <Text style={{ color: "#888", marginTop: 6 }}>No classes found.</Text>}
              </ScrollView>

              <Text style={styles.label}>Roll Number</Text>
              <TextInput style={styles.input} placeholder="Enter Roll Number" value={rollNumber} onChangeText={setRollNumber} keyboardType="numeric" />
            </>
          )}

          <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleCreate} disabled={loading}>
            <Text style={styles.btnText}>{loading ? "Creating..." : "Create Account"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{flexGrow:1,justifyContent:"center",padding:20},
  card:{backgroundColor:"#fff",borderRadius:20,padding:24,shadowColor:"#000",shadowOpacity:0.1,shadowRadius:8,shadowOffset:{width:0,height:3},elevation:6},
  title:{fontSize:24,fontWeight:"800",color:"#1A1A1A",textAlign:"center"},
  subtitle:{fontSize:14,color:"#555",textAlign:"center",marginBottom:20,marginTop:6},
  label:{fontSize:14,fontWeight:"600",color:"#333",marginTop:12},
  input:{borderWidth:1,borderColor:"#D0D7E2",borderRadius:10,padding:12,marginTop:6,backgroundColor:"#F8FAFF"},
  row:{flexDirection:"row",alignItems:"center",marginTop:6},
  verifyBtn:{backgroundColor:"#007AFF",paddingVertical:12,paddingHorizontal:16,borderRadius:10,marginLeft:8,justifyContent:"center",alignItems:"center"},
  verifyText:{color:"#fff",fontWeight:"600"},
  classBtn:{borderWidth:1,borderColor:"#C8D6E5",borderRadius:20,paddingVertical:8,paddingHorizontal:16,marginRight:8,backgroundColor:"#fff",elevation:2},
  classBtnActive:{backgroundColor:"#007AFF",borderColor:"#007AFF"},
  btn:{backgroundColor:"#007AFF",borderRadius:12,marginTop:24,paddingVertical:15,shadowColor:"#007AFF",shadowOpacity:0.3,shadowRadius:6,shadowOffset:{width:0,height:3}},
  btnText:{color:"#fff",textAlign:"center",fontWeight:"700",fontSize:16}
});
