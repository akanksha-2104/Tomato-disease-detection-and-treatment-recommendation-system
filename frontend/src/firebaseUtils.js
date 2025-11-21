import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

// Function to save image + user info
export async function uploadUserData(file, username, email, password) {
  // Convert image to Base64
  const base64Image = await getBase64(file);

  // Save to Firestore
  await addDoc(collection(db, "users"), {
    username,
    email,
    password,
    imageUrl: base64Image, // save image here
    timestamp: new Date()   // optional: keep track of upload time
  });

  console.log("Data saved!");
}

// Helper function to convert image to base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
