import { type Student, type Course } from "@libs/types.js";
export let students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    programId: 101,
    courses: [261207, 261497],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    programId: 102,
    courses: [269101, 261497],
  },
  {
    studentId: "680610703",
    firstName: "Alex",
    lastName: "Mynce",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "680610704",
    firstName: "Steve",
    lastName: "Blokki",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "680610705",
    firstName: "Sunny",
    lastName: "Cubii",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "680610728",
    firstName: "Citron",
    lastName: "Lemoni",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "680610813",
    firstName: "Scor",
    lastName: "Bunny",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "680610814",
    firstName: "Raboot",
    lastName: "Bunny",
    program: "CPE",
    programId: 101,
  },
  {
    studentId: "680612020",
    firstName: "Aung",
    lastName: "Saun",
    program: "ISNE",
    programId: 102,
  },
    {
    studentId: "680612025",
    firstName: "Masat",
    lastName: "Ernh",
    program: "ISNE",
    programId: 102,
  },
];

export let courses: Course[] = [
  {
    courseId: 261207,
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseId: 261497,
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseId: 269101,
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["Kenneth Cosh"],
  },
];