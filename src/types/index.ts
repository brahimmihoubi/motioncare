export type Screen =
  | "splash"
  | "onboarding"
  | "welcome"
  | "dashboard"
  | "patients"
  | "patient-detail"
  | "programs"
  | "edit-program"
  | "exercise-detail"
  | "deviations"
  | "progress"
  | "more"
  | "settings"
  | "signup"
  | "login"
  | "notifications"
  | "add-patient"
  | "add-program";

export type NavParams = {
  patientId?: number;
  programId?: number;
  [key: string]: any;
};

export type NavigateFn = (screen: Screen, params?: NavParams) => void;
