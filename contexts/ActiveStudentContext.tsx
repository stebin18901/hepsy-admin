import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActiveStudentContext = createContext(null);

export function ActiveStudentProvider({ children }) {
  const [activeStudent, setActiveStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      const stored = await AsyncStorage.getItem("activeStudentAccount");
      if (stored) setActiveStudent(JSON.parse(stored));
      setLoading(false);
    };
    loadStudent();
  }, []);

  const selectStudent = async (student) => {
    setActiveStudent(student);
    await AsyncStorage.setItem("activeStudentAccount", JSON.stringify(student));
  };

  const clearStudent = async () => {
    setActiveStudent(null);
    await AsyncStorage.removeItem("activeStudentAccount");
  };

  return (
    <ActiveStudentContext.Provider value={{ activeStudent, selectStudent, clearStudent, loading }}>
      {children}
    </ActiveStudentContext.Provider>
  );
}

export function useActiveStudent() {
  return useContext(ActiveStudentContext);
}
