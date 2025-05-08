import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase/config";

const studentsCollection = collection(db, "students");

// Get all students
export const getAllStudents = async () => {
  try {
    const q = query(studentsCollection, orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting students:", error);
    return [];
  }
};

// Get students filtered by course
export const getStudentsByCourse = async (course) => {
  try {
    // Fix issue with composite index
    const q = query(
      studentsCollection, 
      where("course", "==", course)
    );
    const snapshot = await getDocs(q);
    
    // Sort by name client-side since we can't use composite index easily
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error getting students by course:", error);
    return [];
  }
};

// Get a single student by ID
export const getStudent = async (id) => {
  try {
    const docRef = doc(db, "students", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting student:", error);
    return null;
  }
};

// Add a new student
export const addStudent = async (student) => {
  try {
    const studentWithTimestamp = {
      ...student,
      enrollmentDate: student.enrollmentDate || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(studentsCollection, studentWithTimestamp);
    return {
      id: docRef.id,
      ...studentWithTimestamp
    };
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

// Update a student
export const updateStudent = async (id, student) => {
  try {
    const docRef = doc(db, "students", id);
    await updateDoc(docRef, {
      ...student,
      updatedAt: serverTimestamp()
    });
    return {
      id,
      ...student
    };
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id) => {
  try {
    const docRef = doc(db, "students", id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

// Get all available courses
export const getAvailableCourses = async () => {
  try {
    const snapshot = await getDocs(studentsCollection);
    const courses = new Set();
    courses.add("All");
    
    snapshot.docs.forEach(doc => {
      const student = doc.data();
      if (student.course) {
        courses.add(student.course);
      }
    });
    
    return Array.from(courses);
  } catch (error) {
    console.error("Error getting available courses:", error);
    return ["All"];
  }
}; 