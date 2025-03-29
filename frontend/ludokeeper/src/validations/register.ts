import * as yup from "yup";
import { InferType } from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("El nombre de usuario es obligatorio")
    .matches(/^[a-zA-Z0-9]+$/, "Solo se permiten letras y números")
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres"),
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("Correo no válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .matches(
      passwordRegex,
      "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
    ),
  firstName: yup.string().required("El nombre es obligatorio"),
  lastName: yup.string().required("El apellido es obligatorio"),
});

export type RegisterData = InferType<typeof registerSchema>;
