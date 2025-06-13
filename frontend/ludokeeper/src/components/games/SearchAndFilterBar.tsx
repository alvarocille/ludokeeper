import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import DropdownSelect from "src/components/form/DropdownSelect";
import { useAppTheme } from "src/styles/useAppTheme";

interface Props {
  variant: "inventory" | "catalog";
  filters: {
    name?: string;
    category?: string;
    mechanic?: string;
    minPlayers?: string;
    maxPlayers?: string;
    year?: string;
    source?: string;
  };
  onChange: (key: keyof Props["filters"], value: string) => void;
}

export default function SearchAndFilterBar({
  variant,
  filters,
  onChange,
}: Props) {
  const { colors, fonts } = useAppTheme();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nombre"
        value={filters.name ?? ""}
        onChangeText={(text) => onChange("name", text)}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: `${colors.text}0A`,
            fontFamily: fonts.text,
          },
        ]}
        placeholderTextColor={colors.placeholder}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
      >
        {[
          { key: "category", placeholder: "Categoría" },
          { key: "mechanic", placeholder: "Mecánica" },
          {
            key: "minPlayers",
            placeholder: "Mínimo de jugadores",
            numeric: true,
          },
          {
            key: "maxPlayers",
            placeholder: "Máximo de jugadores",
            numeric: true,
          },
          { key: "year", placeholder: "Año", numeric: true },
        ].map(({ key, placeholder, numeric }) => (
          <TextInput
            key={key}
            placeholder={placeholder}
            keyboardType={numeric ? "numeric" : "default"}
            value={filters[key as keyof Props["filters"]] ?? ""}
            onChangeText={(text) =>
              onChange(key as keyof Props["filters"], text)
            }
            style={[
              styles.filterInput,
              {
                color: colors.text,
                borderColor: colors.border,
                fontFamily: fonts.text,
              },
            ]}
            placeholderTextColor={colors.placeholder}
          />
        ))}

        {variant === "inventory" && (
          <DropdownSelect
            value={filters.source ?? ""}
            onChange={(val) => onChange("source", val)}
            options={[
              { label: "Fuente", value: "" },
              { label: "Catálogo", value: "catalog" },
              { label: "Personalizado", value: "custom" },
            ]}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },
  filterInput: {
    height: 38,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
    minWidth: 110,
  },
});
