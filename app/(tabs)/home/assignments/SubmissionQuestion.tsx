import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UploadCloud } from "lucide-react-native";

export default function SubmissionQuestion({
  question,
  answer,
  onChange,
  onFilePick,
  uploadProgress = 0,
}) {
  const { qNo, text, type, options } = question;

  const handleSelect = (optIndex) => {
    if (type === "mcq") onChange(qNo, optIndex);
    else if (type === "msq") {
      const arr = Array.isArray(answer) ? [...answer] : [];
      const idx = arr.indexOf(optIndex);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(optIndex);
      onChange(qNo, arr);
    }
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#f4f8ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Header */}
      <LinearGradient
        colors={["#1e88e5", "#42a5f5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.qHeader}
      >
        <Text style={styles.qNo}>Q{qNo}</Text>
        <Text style={styles.qTitle}>{text || "Untitled Question"}</Text>
      </LinearGradient>

      {/* MCQ / MSQ */}
      {["mcq", "msq"].includes(type) && (
        <View style={{ marginTop: 10 }}>
          {options?.map((opt, idx) => {
            const selected =
              (type === "mcq" && answer === idx) ||
              (type === "msq" && Array.isArray(answer) && answer.includes(idx));

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => handleSelect(idx)}
                style={[
                  styles.option,
                  selected && {
                    backgroundColor: "#e3f2fd",
                    borderColor: "#1e88e5",
                    shadowColor: "#1e88e5",
                    shadowOpacity: 0.15,
                    shadowRadius: 5,
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && { color: "#1565c0", fontWeight: "700" },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Short / Long Answer */}
      {type === "short" || type === "long" ? (
        <TextInput
          style={[
            styles.input,
            type === "long" && { height: 100, textAlignVertical: "top" },
          ]}
          placeholder={
            type === "short"
              ? "Enter short answer"
              : "Write your descriptive answer"
          }
          value={answer}
          multiline={type === "long"}
          onChangeText={(v) => onChange(qNo, v)}
        />
      ) : null}

      {/* Numeric */}
      {type === "numeric" && (
        <TextInput
          style={styles.input}
          placeholder="Enter numeric answer"
          keyboardType="numeric"
          value={answer}
          onChangeText={(v) => onChange(qNo, v)}
        />
      )}

      {/* File Upload */}
      {type === "file" && (
        <View style={styles.fileUploadBox}>
          {uploadProgress > 0 && uploadProgress < 100 ? (
            <View style={styles.progressContainer}>
              <ActivityIndicator color="#1e88e5" size="small" />
              <Text style={styles.uploadText}>
                Uploading... {Math.round(uploadProgress)}%
              </Text>
            </View>
          ) : answer?.name ? (
            <View style={styles.fileSuccess}>
              <Text style={styles.fileName}>📄 {answer.name}</Text>
              <Text style={styles.uploadTextDone}>Uploaded ✓</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.fileBtn,
                uploadProgress > 0 && uploadProgress < 100 && { opacity: 0.5 },
              ]}
              disabled={uploadProgress > 0 && uploadProgress < 100}
              onPress={() => onFilePick(qNo)}
            >
              <UploadCloud size={18} color="#1565c0" />
              <Text style={styles.fileText}>Upload File</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },

  /** Header **/
  qHeader: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  qNo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    marginRight: 8,
    opacity: 0.9,
  },
  qTitle: {
    fontSize: 14.5,
    color: "#ffffff",
    fontWeight: "600",
    flexShrink: 1,
  },

  /** Options **/
  option: {
    backgroundColor: "#f3f6f9",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  optionText: { fontSize: 14, color: "#37474f" },

  /** Input **/
  input: {
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#37474f",
    marginTop: 10,
    backgroundColor: "#ffffffcc",
  },

  /** File Upload **/
  fileUploadBox: {
    marginTop: 10,
    alignItems: "center",
  },
  fileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  fileText: {
    color: "#1565c0",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 14,
  },
  fileSuccess: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  fileName: { fontWeight: "600", color: "#2e7d32", marginBottom: 4 },
  uploadTextDone: { color: "#388e3c", fontSize: 13, fontWeight: "600" },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f1f8fe",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  uploadText: { color: "#1e88e5", fontSize: 13, fontWeight: "500" },
});
