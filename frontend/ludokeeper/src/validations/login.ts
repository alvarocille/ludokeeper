import * as yup from "yup";
import { InferType } from "yup";

export const loginSchema = yup.object({
  username: yup.string().required("El nombre de usuario es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

export type LoginData = InferType<typeof loginSchema>;
