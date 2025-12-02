import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";
import QuizScreen from "@/components/student/QuizScreen";

const toMillis = (v: any) => {
  if (!v) return 0;
  if (typeof v === "number") return v;
  if (typeof v.toMillis === "function") return v.toMillis();
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
};

export default function QuizHost() {
  const { activeStudent } = useActiveStudent();
  const { subject, cls, chapter } = useLocalSearchParams<{ subject: string; cls: string; chapter: string }>();

  const [loading, setLoading] = useState(true);
  const [quizList, setQuizList] = useState<{ quizId: string; concept: string; createdAt: number; questions: any[] }[]>([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "quizzes"));
        const arr: any[] = [];
        snap.forEach(d => {
          const data: any = d.data();
          const md = data?.metadata || {};
          if (md.subject === subject && String(md.class) === String(cls) && md.chapter === chapter) {
            arr.push({
              quizId: d.id,
              concept: md.concept || "",
              createdAt: toMillis(md.createdAt),
              questions: data?.questions || [],
            });
          }
        });
        arr.sort((a, b) => a.createdAt - b.createdAt);
        setQuizList(arr);
      } finally {
        setLoading(false);
      }
    };
    if (subject && cls && chapter) run();
  }, [subject, cls, chapter]);

  if (loading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator size="large" color="#1e88e5" /></View>;

  return (
    <QuizScreen
      chapter={String(chapter)}
      quizList={quizList}
      userId={String(activeStudent?.uid || activeStudent?.id || "guest")}
      onFinish={() => router.replace({ pathname: "/(tabs)/student/chapters", params: { subject, cls } })}
    />
  );
}
