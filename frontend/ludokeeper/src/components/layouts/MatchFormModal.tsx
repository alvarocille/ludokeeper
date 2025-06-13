import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { CreateMatchDTO, Match, createMatch, updateMatch } from "src/api/match";
import { Button } from "src/components/button/Button";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import DatePickerModal from "../form/DatePickerModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Match | null;
}

export default function MatchFormModal({
  visible,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const { colors } = useAppTheme();
  const { token } = useAuthStore();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CreateMatchDTO>({
      defaultValues: {
        date: "",
        durationMinutes: 60,
        players: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });

  const date = watch("date");

  useEffect(() => {
    if (initialData) {
      reset({
        date: initialData.date.split("T")[0],
        durationMinutes: initialData.durationMinutes,
        players: initialData.players,
      });
    }
  }, [initialData]);

  const onSubmit = async (data: CreateMatchDTO) => {
    try {
      if (!token) throw new Error("Token inválido");

      const cleanedPlayers = data.players.filter((p) => p.name.trim() !== "");

      if (cleanedPlayers.length === 0) {
        Alert.alert("Error", "Añade al menos un jugador con nombre.");
        return;
      }

      const cleanedData = {
        ...data,
        players: cleanedPlayers,
      };

      if (initialData) {
        await updateMatch(token, initialData._id, cleanedData);
      } else {
        await createMatch(token, cleanedData);
      }

      onSuccess();
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar la partida");
      console.error("MatchForm error:", err);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000088",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            {initialData ? "Editar partida" : "Nueva partida"}
          </Text>

          <ScrollView>
            <Text style={{ color: colors.text }}>Fecha</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: colors.text }}>
                {date || "Seleccionar fecha"}
              </Text>
            </Pressable>

            <Text style={{ color: colors.text }}>Duración (minutos)</Text>
            <Controller
              control={control}
              name="durationMinutes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value.toString()}
                  onChangeText={(v) => {
                    const parsed = parseInt(v);
                    onChange(isNaN(parsed) ? 0 : parsed);
                  }}
                  keyboardType="numeric"
                  placeholder="Duración"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    color: colors.text,
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 12,
                  }}
                />
              )}
            />

            <Text
              style={{
                color: colors.text,
                marginBottom: 8,
                fontWeight: "bold",
              }}
            >
              Jugadores
            </Text>

            {fields.map((field, index) => (
              <View
                key={field.id}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Controller
                  control={control}
                  name={`players.${index}.name`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Nombre del jugador"
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        color: colors.text,
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 6,
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`players.${index}.score`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value?.toString() || ""}
                      onChangeText={(v) => {
                        const parsed = parseInt(v);
                        onChange(isNaN(parsed) ? 0 : parsed);
                      }}
                      keyboardType="numeric"
                      placeholder="Puntaje"
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        color: colors.text,
                        borderRadius: 8,
                        padding: 8,
                      }}
                    />
                  )}
                />
                <Pressable
                  onPress={() => remove(index)}
                  style={{ marginTop: 6 }}
                >
                  <Text style={{ color: colors.error }}>Eliminar jugador</Text>
                </Pressable>
              </View>
            ))}

            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Pressable
                onPress={() => append({ name: "", score: 0 })}
                style={{
                  backgroundColor: colors.secondary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                  + Añadir jugador
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 12,
            }}
          >
            <Button variant="secondary" onPress={onClose} title="Cancelar" />
            <Button
              variant="secondary"
              onPress={handleSubmit(onSubmit)}
              title="Guardar"
            />
          </View>
        </View>
      </View>

      <DatePickerModal
        visible={showDatePicker}
        initialDate={date}
        onConfirm={(newDate) => {
          setValue("date", newDate);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </Modal>
  );
}
