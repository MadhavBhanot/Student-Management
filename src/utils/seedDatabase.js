import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Sample student data
const sampleStudents = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-09-01",
    gpa: 3.8
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    course: "Data Science",
    enrollmentDate: "2023-08-15",
    gpa: 3.9
  },
  {
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    course: "Artificial Intelligence",
    enrollmentDate: "2023-09-05",
    gpa: 3.7
  },
  {
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-08-20",
    gpa: 3.6
  },
  {
    name: "Robert Brown",
    email: "robert.brown@example.com",
    course: "Cybersecurity",
    enrollmentDate: "2023-09-10",
    gpa: 3.5
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    course: "Web Development",
    enrollmentDate: "2023-07-15",
    gpa: 3.9
  },
  {
    name: "David Wilson",
    email: "david.wilson@example.com",
    course: "Network Engineering",
    enrollmentDate: "2023-08-05",
    gpa: 3.4
  }
];

// Function to seed database
export const seedDatabase = async (userId = null) => {
  const studentsCollection = collection(db, "students");
  let addedCount = 0;

  try {
    // Check if we already have students in the database
    const snapshot = await getDocs(studentsCollection);
    
    // Only seed if the database is empty
    if (snapshot.empty) {
      // Add each student to Firestore
      for (const student of sampleStudents) {
        await addDoc(studentsCollection, {
          ...student,
          addedBy: userId || 'system',
          createdAt: serverTimestamp()
        });
        addedCount++;
      }
      console.log(`Database seeded with ${addedCount} students`);
      return { success: true, count: addedCount };
    } else {
      console.log("Database already has students, skipping seed operation");
      return { success: false, message: "Database already has students" };
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error };
  }
};

// Function to check if students exist and seed if not
export const checkAndSeedDatabase = async (userId = null) => {
  try {
    const studentsCollection = collection(db, "students");
    const snapshot = await getDocs(studentsCollection);
    
    if (snapshot.empty) {
      return await seedDatabase(userId);
    } else {
      return { success: true, message: "Database already has students", count: snapshot.size };
    }
  } catch (error) {
    console.error("Error checking database:", error);
    return { success: false, error };
  }
}; 