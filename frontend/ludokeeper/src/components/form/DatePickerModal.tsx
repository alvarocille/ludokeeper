import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useAppTheme } from "src/styles/useAppTheme";

interface Props {
  visible: boolean;
  initialDate?: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

export default function DatePickerModal({
  visible,
  initialDate,
  onConfirm,
  onCancel,
}: Props) {
  const { colors, fonts } = useAppTheme();
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(initialDate || today);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.heading,
              color: colors.text,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Selecciona una fecha
          </Text>

          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: colors.primary,
              },
            }}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.text,
              selectedDayTextColor: colors.background,
              dayTextColor: colors.text,
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              textMonthFontFamily: fonts.heading,
              textDayFontFamily: fonts.text,
              textDayHeaderFontFamily: fonts.text,
            }}
          />

          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={onCancel}>
              <Ionicons name="close" size={20} color={colors.text} />
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => onConfirm(selectedDate)}
            >
              <Ionicons name="checkmark" size={20} color={colors.background} />
              <Text style={[styles.buttonText, { color: colors.background }]}>
                Aceptar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    elevation: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
