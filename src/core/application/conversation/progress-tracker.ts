import type {
  ConversationState,
  QualificationKey,
} from "@/core/domain/conversation";

export interface ProgressItem {
  key: QualificationKey;
  label: string;
  complete: boolean;
}

const progressDefinition: ReadonlyArray<{
  key: QualificationKey;
  label: string;
}> = [
  { key: "greeting", label: "Greeting" },
  { key: "budget", label: "Budget" },
  { key: "propertyType", label: "Property Type" },
  { key: "location", label: "Location" },
  { key: "timeline", label: "Timeline" },
  { key: "financing", label: "Financing" },
  { key: "appointment", label: "Appointment" },
];

export function getQualificationProgress(
  state: ConversationState,
): ProgressItem[] {
  return progressDefinition.map((item) => ({
    ...item,
    complete: Boolean(state.qualification[item.key]),
  }));
}
