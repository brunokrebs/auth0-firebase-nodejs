let _messagesDb = null;

class Firebase {
  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyC33iBzEExakOxlazsfNJ1EFyHPeIC2FvE',
      authDomain: 'auth0-and-firebase.firebaseapp.com',
      projectId: 'auth0-and-firebase',
    });

    // initialize firestore
    _messagesDb = firebase.firestore();

    // disable deprecated features
    _messagesDb.settings({
      timestampsInSnapshots: true
    });
  }

  async addMessage(message) {
    const createdAt = new Date();
    const author = firebase.auth().currentUser.displayName;
    return await _messagesDb.collection('messages').add({
      author,
      createdAt,
      message,
    });
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  setAuthStateListener(listener) {
    firebase.auth().onAuthStateChanged(listener);
  }

  setMessagesListener(listener) {
    _messagesDb.collection('messages').orderBy('createdAt', 'desc').limit(10).onSnapshot(listener);
  }

  async setToken(token) {
    await firebase.auth().signInWithCustomToken(token);
  }

  async signOut() {
    await firebase.auth().signOut();
  }

  async updateProfile(profile) {
    if (!firebase.auth().currentUser) return;
    console.log(profile.name);
    console.log(profile.picture);
    await firebase.auth().currentUser.updateProfile({
      displayName: profile.name,
      photoURL: profile.picture,
    });
  }
}

const firebaseClient = new Firebase();
