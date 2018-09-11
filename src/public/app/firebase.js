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
    return await _messagesDb.collection('messages').add({
      message,
    });
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  setAuthStateListener(listener) {
    firebase.auth().onAuthStateChanged(listener);
  }

  async setToken(token) {
    await firebase.auth().signInWithCustomToken(token);
  }

  async signOut() {
    await firebase.auth().signOut();
  }

  async updateProfile(profile) {
    if (!firebase.auth().currentUser) return;
    await firebase.auth().currentUser.updateProfile({
      displayName: profile.name,
      photoURL: profile.picture,
    });
  }
}

const firebaseClient = new Firebase();
