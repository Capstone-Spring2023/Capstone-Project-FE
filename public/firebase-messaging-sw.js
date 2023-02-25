// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
// eslint-disable-next-line no-undef

const firebaseConfig = {
  apiKey: "AIzaSyCoQVZnZFVPgJbdCR0_cT7N8qEkUE_W7Gk",
  authDomain: "capstone-cft.firebaseapp.com",
  databaseURL:
    "https://capstone-cft-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstone-cft",
  storageBucket: "capstone-cft.appspot.com",
  messagingSenderId: "240001179952",
  appId: "1:240001179952:web:a47e364ed5086f3848e8f5",
  measurementId: "G-Q1YQBVJXWP",
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
      notificationOptions);
});
