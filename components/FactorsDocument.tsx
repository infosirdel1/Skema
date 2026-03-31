import { View, Text, StyleSheet } from "react-native";

const COLUMNS = [
  "AA",
  "AD",
  "AE",
  "AF",
  "AG",
  "AH",
  "AK",
  "AL",
  "AM",
  "AN",
  "BA",
  "BB",
  "BC",
  "BD",
  "BE",
  "CA",
  "CB",
];

type Props = {
  rows: any[];
};

export default function FactorsDocument({ rows }: Props) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Influences externes</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.cellLocal}>LOCAL</Text>
          {COLUMNS.map((c) => (
            <Text key={c} style={styles.cell}>
              {c}
            </Text>
          ))}
          <Text style={styles.cell}>PUB</Text>
        </View>

        {rows.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.cellLocal}>{row.local}</Text>

            {COLUMNS.map((col) => (
              <Text key={col} style={styles.cell}>
                {typeof row[col] === "string" ? row[col] : ""}
              </Text>
            ))}

            <Text style={styles.cell}>{row.public ? "OUI" : "NON"}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cartouche}>
        <View style={styles.cartoucheBox}>
          <Text style={styles.cartoucheTitle}>Organisme de contrôle</Text>
        </View>

        <View style={styles.cartoucheBox}>
          <Text style={styles.cartoucheTitle}>{"Gestionnaire de l'installation"}</Text>
        </View>

        <View style={styles.cartoucheBox}>
          <Text style={styles.cartoucheTitle}>Infos document</Text>
          <Text style={styles.cartoucheText}>Date :</Text>
          <Text style={styles.cartoucheText}>Version :</Text>
          <Text style={styles.cartoucheText}>Page : 1/1</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    backgroundColor: "#fff",
    width: "100%",
  },

  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  table: {
    borderWidth: 1,
    borderColor: "#000",
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  cellLocal: {
    width: 140,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 2,
  },

  cell: {
    width: 40,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },

  cartouche: {
    flexDirection: "row",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#000",
  },

  cartoucheBox: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 6,
    minHeight: 80,
  },

  cartoucheTitle: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },

  cartoucheText: {
    fontSize: 10,
  },
});
