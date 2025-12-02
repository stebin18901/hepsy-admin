
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export function useAssignments(activeStudent) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStudent?.className || !activeStudent?.schoolId) return;
    async function fetchAssignments() {
      setLoading(true);
      try {
        const q = query(collection(db, "assignments"), where("status", "==", "published"));
        const snap = await getDocs(q);
        const arr = [];
        snap.forEach((d) => {
          const data = d.data();
          const assignedTo = data.assignedClasses || [];
          const match =
            assignedTo.includes(activeStudent.className) ||
            assignedTo.includes(`${activeStudent.schoolId}_${activeStudent.className}`);
          if (match) arr.push({ id: d.id, ...data });
        });
        setAssignments(arr);
      } catch (e) {
        console.error("Error fetching assignments:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, [activeStudent]);

  return { assignments, pendingCount: assignments.length, loading };
}
