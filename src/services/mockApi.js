import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a new instance of axios
const axiosInstance = axios.create();

// Create a mock adapter
const mock = new MockAdapter(axiosInstance, { delayResponse: 1000 });

// Sample student data
const initialStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-09-01",
    gpa: 3.8
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    course: "Data Science",
    enrollmentDate: "2023-08-15",
    gpa: 3.9
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    course: "Artificial Intelligence",
    enrollmentDate: "2023-09-05",
    gpa: 3.7
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-08-20",
    gpa: 3.6
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.brown@example.com",
    course: "Cybersecurity",
    enrollmentDate: "2023-09-10",
    gpa: 3.5
  }
];

// Store students in memory
let students = [...initialStudents];

// Mock GET request to fetch all students
mock.onGet('/api/students').reply((config) => {
  const { course } = config.params || {};
  
  // Filter students by course if course parameter is provided
  if (course && course !== 'All') {
    const filteredStudents = students.filter(student => student.course === course);
    return [200, filteredStudents];
  }
  
  return [200, students];
});

// Mock GET request to fetch a specific student
mock.onGet(/\/api\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const student = students.find(s => s.id === id);
  
  if (student) {
    return [200, student];
  }
  return [404, { message: 'Student not found' }];
});

// Mock POST request to add a new student
mock.onPost('/api/students').reply((config) => {
  const newStudent = JSON.parse(config.data);
  const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  
  const studentToAdd = {
    id,
    ...newStudent,
    enrollmentDate: new Date().toISOString().split('T')[0]
  };
  
  students.push(studentToAdd);
  return [201, studentToAdd];
});

// Get all available courses
const getAvailableCourses = () => {
  const courses = new Set(students.map(student => student.course));
  return ['All', ...Array.from(courses)];
};

// Export the axios instance
export { axiosInstance, getAvailableCourses }; 