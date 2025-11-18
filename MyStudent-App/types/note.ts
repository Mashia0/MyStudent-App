export interface CourseNote {
  userId: number;
  id: number;
  title: string;
  body: string;
  courseCode?: string;
  instructor?: string;
  weekLabel?: string;
  focusArea?: string;
}

