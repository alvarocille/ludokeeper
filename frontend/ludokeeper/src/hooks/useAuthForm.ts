import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { InferType, ObjectSchema } from "yup";

export function useAuthForm<T extends Record<string, any>>(
  schema: ObjectSchema<T>,
  onSubmit: (data: InferType<typeof schema>) => Promise<void>,
  defaultValuesOverride?: DefaultValues<InferType<typeof schema>>,
) {
  const [serverError, setServerError] = useState("");

  type FormData = InferType<typeof schema>;

  // DefaultValues inicial por defecto: campos vacíos (si no se pasan override)
  const fallbackDefaults = {} as DefaultValues<FormData>;
  for (const key in schema.fields) {
    (fallbackDefaults as any)[key] = "";
  }

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: defaultValuesOverride || fallbackDefaults,
  });

  const handleFormSubmit = form.handleSubmit(async (data) => {
    try {
      setServerError("");
      await onSubmit(data);
    } catch (err: any) {
      console.error("Login error:", err);

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Error inesperado";

      setServerError(msg);
    }
  });

  return {
    ...form,
    serverError,
    handleFormSubmit,
  };
}
