import { RegisterForm } from "@features/auth/ui/RegisterForm.js";
import styles from "./RegisterPage.module.css";
import { useRegister } from "@features/auth/model/useRegister.js";

export default function RegisterPage() {
  const {
    form,
    errors,
    touched,
    updateField,
    handleBlur,
    handleSubmit,
    isLoading,
  } = useRegister();
  return (
    <div className={styles.wrapper}>
      <h2>Register Task Master Pro</h2>
      {errors.general && (
        <div className={styles.errorBanner}>{errors.general}</div>
      )}
      <RegisterForm
        form={form}
        errors={errors}
        touched={touched}
        onChange={updateField}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
