import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode } from "react";
import {
  DefaultValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { View } from "react-native";
import { InferType, ObjectSchema } from "yup";

interface FormContainerProps<TSchema extends ObjectSchema<any>> {
  children: ReactNode;
  schema: TSchema;
  onSubmit: SubmitHandler<InferType<TSchema>>;
  defaultValues?: DefaultValues<InferType<TSchema>>;
}

export function FormContainer<TSchema extends ObjectSchema<any>>({
  children,
  schema,
  onSubmit,
  defaultValues,
}: FormContainerProps<TSchema>) {
  const methods = useForm<InferType<TSchema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <View>{children}</View>
    </FormProvider>
  );
}
