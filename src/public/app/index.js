const signInButton = document.getElementById('sign-in');
const submitMessageButton = document.getElementById('submit-message');
const profileElement = document.getElementById('profile');
const messageInput = document.getElementById('message');

submitMessageButton.addEventListener('click', async () => {
  try {
    const docRef = firebaseClient.addMessage({
      message: messageInput.value
    });
    console.log(docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
});

signInButton.addEventListener('click', async () => {
  auth0Client.signIn();
});

async function setFirebaseCustomToken() {
  await firebaseClient.updateProfile(auth0Client.getProfile());

  const response = await fetch('http://localhost:3001/firebase', {
    headers: {
      'Authorization': `Bearer ${auth0Client.getIdToken()}`,
    },
  });

  const data = await response.json();
  await firebaseClient.setToken(data.firebaseToken);
}

(async () => {
  firebaseClient.setAuthStateListener((user) => {
    if (!user) {
      profileElement.innerText = '';
      signInButton.style.display = 'inline-block';
      return;
    }

    profileElement.innerText = `Hello, ${firebaseClient.getCurrentUser().displayName}.`;
    signInButton.style.display = 'none';
  });

  const loggedInThroughCallback = await auth0Client.handleCallback();

  if (loggedInThroughCallback) await setFirebaseCustomToken();
})();
