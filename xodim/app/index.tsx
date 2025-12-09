import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  username: string;
  phone?: string;
  company?: { _id: string; nom: string };
  department?: { _id: string; nom: string };
  position?: { _id: string; nom: string };
}

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const employeeData = await AsyncStorage.getItem("employee");

      if (!token || !employeeData) {
        router.replace("/login");
        return;
      }

      setEmployee(JSON.parse(employeeData));
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("employee");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Xush kelibsiz!</Text>
        <Text style={styles.name}>
          {employee?.firstName} {employee?.lastName}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Username" value={employee?.username} />
        <InfoRow label="Telefon" value={employee?.phone} />
        <InfoRow label="Kompaniya" value={employee?.company?.nom} />
        <InfoRow label="Bo'lim" value={employee?.department?.nom} />
        <InfoRow label="Lavozim" value={employee?.position?.nom} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  welcome: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f8fafc",
  },
  infoCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  infoLabel: {
    fontSize: 14,
    color: "#94a3b8",
  },
  infoValue: {
    fontSize: 14,
    color: "#f8fafc",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
