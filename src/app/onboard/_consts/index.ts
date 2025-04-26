export interface IQuestion {
  id: number;
  question: string;
  options: string[];
  field: string;
  isOption?: boolean;
}

export const ONBOARD_QUESTIONS: IQuestion[] = [
  {
    id: 1,
    question: "How old are you?",
    options: [],
    field: "age",
    isOption: false,
  },
  {
    id: 2,
    question: "What is your gender?",
    options: ["male", "female", "other"],
    field: "gender",
    isOption: true,
  },
  {
    id: 3,
    question: "What medications do you take and at what times?",
    options: [],
    field: "medication",
    isOption: false,
  },
  {
    id: 4,
    question:
      "Who should we contact in case of an emergency and their phone number?",
    options: [],
    field: "emergency",
    isOption: false,
  },
  {
    id: 5,
    question: "What daily activities do you never miss?",
    options: [
      "Gardening",
      "Watching TV",
      "Drinking Tea",
      "Reading",
      "Calling Family",
      "Other",
    ],
    field: "habits",
    isOption: false,
  },
  {
    id: 6,
    question:
      "Where do you usually keep your important items (keys, phone, wallet)?",
    options: [],
    field: "important_notes",
    isOption: false,
  },
];
