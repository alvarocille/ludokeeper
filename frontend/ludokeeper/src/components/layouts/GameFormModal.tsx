import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { addGame, updateGame } from "src/api/inventory";
import DatePickerModal from "src/components/form/DatePickerModal";
import FormButton from "src/components/form/FormButton";
import Input from "src/components/form/Input";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { z } from "zod";
import { Game } from "../games/GameCard";

const positiveIntOptional = z
  .union([z.string().regex(/^\d+$/), z.number().int().min(1)])
  .transform((val) => (val === "" ? undefined : Number(val)))
  .optional();

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  minPlayers: positiveIntOptional,
  maxPlayers: positiveIntOptional,
  playTime: positiveIntOptional,
  imageUrl: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
      message: "Debe ser una URL válida",
    }),
  notes: z.string().optional(),
  acquisitionDate: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Formato inválido (YYYY-MM-DD)",
    }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Game | null;
}

export default function GameFormModal({
  visible,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const { colors, fonts } = useAppTheme();
  const { token } = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const defaultValues = {
      name: initialData?.customData.name || "",
      description: initialData?.customData.description || "",
      minPlayers: initialData?.customData.minPlayers,
      maxPlayers: initialData?.customData.maxPlayers,
      playTime: initialData?.customData.playTime,
      imageUrl: initialData?.customData.imageUrl || "",
      notes: initialData?.notes || "",
      acquisitionDate: initialData?.acquisitionDate?.slice(0, 10) || "",
    };

    reset(defaultValues);
  }, [visible, reset, initialData]);

  const onSubmit = async (values: FormData) => {
    try {
      const { name, description, minPlayers, maxPlayers, playTime, imageUrl } =
        values;

      const customData = {
        name,
        ...(description && { description }),
        ...(minPlayers && { minPlayers }),
        ...(maxPlayers && { maxPlayers }),
        ...(playTime && { playTime }),
        ...(imageUrl && { imageUrl }),
      };

      if (initialData) {
        await updateGame(token!, initialData._id, { customData });
      } else {
        await addGame(token!, { source: "custom", customData });
      }

      onSuccess();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={stylesOverlay.overlay}>
        <View
          style={[stylesOverlay.modal, { backgroundColor: colors.background }]}
        >
          <ScrollView>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 12,
                color: colors.text,
                fontFamily: fonts.heading,
                textAlign: "center",
              }}
            >
              {initialData ? "Editar juego" : "Agregar juego"}
            </Text>

            <Input
              name="name"
              control={control}
              placeholder="Nombre"
              error={errors.name?.message}
            />
            <Input
              name="description"
              control={control}
              placeholder="Descripción"
              error={errors.description?.message}
            />
            <Input
              name="minPlayers"
              control={control}
              placeholder="Jugadores mínimos"
              keyboardType="numeric"
              error={errors.minPlayers?.message}
            />
            <Input
              name="maxPlayers"
              control={control}
              placeholder="Jugadores máximos"
              keyboardType="numeric"
              error={errors.maxPlayers?.message}
            />
            <Input
              name="playTime"
              control={control}
              placeholder="Duración (minutos)"
              keyboardType="numeric"
              error={errors.playTime?.message}
            />
            <Input
              name="imageUrl"
              control={control}
              placeholder="URL de la imagen"
              error={errors.imageUrl?.message}
            />
            <Input
              name="notes"
              control={control}
              placeholder="Notas personales"
              error={errors.notes?.message}
            />

            {/* Date Picker Selector */}
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
                borderColor: colors.border,
                backgroundColor: `${colors.text}0A`,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fonts.text,
                }}
              >
                {watch("acquisitionDate") || "Seleccionar fecha de adquisición"}
              </Text>
              {errors.acquisitionDate?.message && (
                <Text style={{ color: colors.error, fontSize: 12 }}>
                  {errors.acquisitionDate.message}
                </Text>
              )}
            </Pressable>

            <DatePickerModal
              visible={showDatePicker}
              initialDate={watch("acquisitionDate")}
              onCancel={() => setShowDatePicker(false)}
              onConfirm={(date) => {
                setValue("acquisitionDate", date);
                setShowDatePicker(false);
              }}
            />

            <FormButton
              title="Guardar"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
            <FormButton title="Cancelar" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const stylesOverlay = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
});
