const signInButton = document.getElementById('sign-in');
const profileElement = document.getElementById('profile');
const messageInput = document.getElementById('message');

messageInput.addEventListener('keyup', async (event) => {
  if (event.code !== 'Enter') return;
  firebaseClient.addMessage({
    message: messageInput.value
  });
  messageInput.value = '';
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
      messageInput.disabled = true;
      return;
    }

    profileElement.innerText = `Hello, ${firebaseClient.getCurrentUser().displayName}.`;
    signInButton.style.display = 'none';
    messageInput.disabled = false;
  });

  const loggedInThroughCallback = await auth0Client.handleCallback();

  if (loggedInThroughCallback) await setFirebaseCustomToken();
})();
