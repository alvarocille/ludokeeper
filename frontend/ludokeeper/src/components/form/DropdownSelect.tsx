import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "src/styles/useAppTheme";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DropdownSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
}: Props) {
  const { colors, fonts } = useAppTheme();
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: `${colors.text}0A`,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={{
            color: value ? colors.text : colors.placeholder,
            fontFamily: fonts.text,
          }}
        >
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.text} />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modal,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <ScrollView>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fonts.text,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 8,
    minWidth: 140,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000066",
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: "60%",
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
