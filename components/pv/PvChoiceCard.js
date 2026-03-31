import { Pressable, Text, StyleSheet } from "react-native";

export default function PvChoiceCard({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 86,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: "#111111",
    borderColor: "#E50914",
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  labelSelected: {
    color: "#FFFFFF",
  },
});
