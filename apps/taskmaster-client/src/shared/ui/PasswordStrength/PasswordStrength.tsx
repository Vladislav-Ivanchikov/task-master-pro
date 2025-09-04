import React from "react";
import { passwordValidation } from "@shared/lib/validation.js";
import styles from "./PasswordStrength.module.css";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  const validation = passwordValidation(password);
  const validChecks = validation.errors.length;
  const totalChecks = 3; // We have 3 validation rules
  const strengthPercentage = ((totalChecks - validChecks) / totalChecks) * 100;

  const getStrengthLabel = () => {
    if (strengthPercentage <= 20) return "Very Weak";
    if (strengthPercentage <= 40) return "Weak";
    if (strengthPercentage <= 60) return "Fair";
    if (strengthPercentage <= 80) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return "#ff4444";
    if (strengthPercentage <= 40) return "#ff8800";
    if (strengthPercentage <= 60) return "#ffcc00";
    if (strengthPercentage <= 80) return "#88cc00";
    return "#44cc44";
  };

  const getRequirements = () => {
    return [
      { text: "At least 8 characters", met: password.length >= 8 },
      {
        text: "At least one uppercase letter",
        met: /(?=.*[A-Z])/.test(password),
      },
      { text: "At least one number", met: /(?=.*\d)/.test(password) },
    ];
  };

  return (
    <div className={styles.container}>
      <div className={styles.strengthBar}>
        <div
          className={styles.strengthFill}
          style={{
            width: `${strengthPercentage}%`,
            backgroundColor: getStrengthColor(),
          }}
        />
      </div>
      <div
        className={styles.strengthLabel}
        style={{ color: getStrengthColor() }}
      >
        {getStrengthLabel()}
      </div>
      <div className={styles.requirements}>
        {getRequirements().map((req, index) => (
          <div
            key={index}
            className={`${styles.requirement} ${req.met ? styles.met : styles.unmet}`}
          >
            <span className={styles.checkmark}>{req.met ? "✓" : "✗"}</span>
            {req.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
