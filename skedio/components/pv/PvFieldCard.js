import { View, Text, TextInput, StyleSheet } from "react-native";

export default function PvFieldCard({
  label,
  value,
  onChangeText,
  onFocus,
  error,
  placeholder,
  optional = false,
  multiline = false,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        {label} {optional ? <Text style={styles.optional}>(optionnel)</Text> : null}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
      {error && (
        <Text style={{ color: "#E50914", fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  optional: {
    fontWeight: "400",
    color: "#A0A0A0",
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  inputMultiline: {
    minHeight: 96,
    paddingTop: 14,
    textAlignVertical: "top",
  },
});
