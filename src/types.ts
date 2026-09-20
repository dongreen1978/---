export interface StudentDetails {
  timestamp: string;
  fullName: string;
  idNumber: string;
  layer: string;
  classNum: number;
  masteryLevel: number;
  homework: string;
}

export interface ExamAnswers {
  q1_answer?: string;
  q2_answer?: string;
  q3_answer?: string;
  q4a_answer?: string;
  q4b_answer?: string;
  q5_answer?: string;
  q6_answer?: string;
  q7_answer?: string;
  q8_answer?: string;
  q9a_answer?: string;
  q9b_answer?: string;
  q9c_answer?: string;
  q9d_answer?: string;
  q9e_answer?: string;
  q9f_answer?: string;
  q9g_answer?: string;
  q10a_answer?: string;
  q10b_s1?: string;
  q10b_r1?: string;
  q10b_s2?: string;
  q10b_r2?: string;
  q10b_s3?: string;
  q10b_thm?: string;
  q10b_tri?: string;
  q10b_summary?: string;
}

export interface QuestionTimes {
  q1_time?: string;
  q2_time?: string;
  q3_time?: string;
  q4_time?: string;
  q5_time?: string;
  q6_time?: string;
  q7_time?: string;
  q8_time?: string;
  q9_time?: string;
  q10a_time?: string;
  q10b_time?: string;
  totalTime?: string;
}

export interface QuestionMeta {
  id: string;
  stepIndex: number;
  title: string;
  section: string;
  durationSeconds: number;
  points: number;
}
