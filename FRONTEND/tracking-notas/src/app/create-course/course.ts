export interface Course {
    idCourse: number;
    nameCourse: string;
    credit: number | null;
    prerequisite: number | null;
    semester: number | null;
    laboratory: boolean;
    hoursTeory: number | null;
    hoursPractice: number | null;
    p1: number | null;
    p2: number | null;
    p3: number | null;
    e1: number | null;
    e2: number | null;
    e3: number | null;
    status: boolean;
}
