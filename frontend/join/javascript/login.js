let BASE_URL = "http://127.0.0.1:8000/api/";
// let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/accounts.json"
let currentUser = {};
const TOKEN = localStorage.getItem("token");

/**
 * Starts the login animation by calling `startLogInAnimation`.
 */
function start() {
  startLogInAnimation();
  let remember = localStorage.getItem("remember-me");
  let checkbox = document.getElementById("remember-me-box");

  if (remember == "checked") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
    deleteToken();
  }
}

function checkRememberMe() {
  let checkbox = document.getElementById("remember-me-box");

  if (checkbox.checked) {
    localStorage.setItem("remember-me", "checked");
  } else {
    localStorage.setItem("remember-me", "not-checked");
  }
}

function deleteToken() {
  localStorage.removeItem("token");
}

/**
 * Initiates the login animation by hiding the overlay after a short delay.
 */
function startLogInAnimation() {
  const overlay = document.querySelector(".overlay");
  const logo = document.querySelector(".log-in-join-logo");
  // Set the image to visible and start the animation
  setTimeout(() => {
    overlay.classList.add("hidden"); // Hide the overlay
  }, 300); // Delay as needed
}

/**
 * Handles the login process. Prevents default form submission and loads accounts.
 * @param {Event} event - The event object representing the form submission.
 */
function logIn(event) {
  event.preventDefault();
  accounts = [];
  checkUserData();
}

/**
 * Posts the current user's name and email to the server.
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @throws {Error} Throws an error if the network request fails.
 */
async function postCurrentUser(userName, userEmail, token, userid) {
  try {
    const response = await fetch(currentUserURL + "1/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameIn: `${userName}`, emailIn: `${userEmail}`, token: `${token}`, user: `${userid}` }),
    });
    if (!response.ok) {
      throw new Error("Error posting data");
    }
  } catch (error) {
    console.error("Error posting current user:", error);
  }
}

/**
 * Loads user accounts from the server and checks user data.
 */
// function loadAccounts() {
//   fetch(BASE_URL)
//     .then((response) => response.json())
//     .then((result) => {
//       const accounts = Object.values(result);
//       checkUserData(accounts);
//     })
//     .catch((error) => console.log("Error fetching data:", error));
// }

/**
 * Checks the user data against the provided accounts and logs in the user if valid.
 * Redirects to the summary page if successful, otherwise shows an error.
 * @param {Array} accounts - An array of user account objects.
 */
async function checkUserData() {
  let userEmail = document.getElementById("user-email").value;
  let userPassword = document.getElementById("user-password").value;
  // let user = accounts.find(a => a.email == userEmail && a.password == userPassword);

  try {
    let user = await fetch(BASE_URL + "login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });
    if (user.status == 200) {
      currentUser = await user.json();
      let currentAccountName = currentUser.username;
      let currentEmail = currentUser.email;
      let currentToken = currentUser.token;

      await postCurrentUser(currentAccountName, currentEmail, currentToken, currentUser.user);
      window.location.href = `./documents/summary.html?name=${encodeURIComponent(currentAccountName)}`;
      localStorage.setItem("token", currentUser.token);

      closeAddContactDialog();
      initialize();
    } else {
      document.getElementById("user-email").classList.add("border-color-red");
      document.getElementById("user-password").classList.add("border-color-red");
      renderWrongLogIn();
      return;
    }
  } catch (error) {
    console.log("Error pushing data:", error);
  }
}

/**
 * Renders an error message for incorrect login attempts.
 */
function renderWrongLogIn() {
  document.getElementById("wrong-log-in").innerHTML = `
  Check your email and password. Please try again.`;
}

/**
 * Changes the password icon based on the input's value length.
 * @param {string} inputID - The ID of the password input element.
 * @param {string} spanID - The ID of the span element containing the icon.
 */
function changePasswordIcon(inputID, spanID) {
  let currentInputID = document.getElementById(`${inputID}`);
  let valueLength = currentInputID.value.length;
  let iconBox = document.getElementById(`${spanID}`);
  iconBox.classList.remove("d-none");
  if (valueLength > 0) {
    currentInputID.classList.remove("password-input");
  } else {
    currentInputID.classList.add("password-input");
    iconBox.classList.add("d-none");
  }
  iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility_off.svg" alt="open-eye">`;
}

/**
 * Toggles the type of the input between 'password' and 'text' to show or hide the password.
 * @param {string} inputID - The ID of the password input element.
 * @param {string} spanID - The ID of the span element containing the icon.
 */
function changeInputType(inputID, spanID) {
  let currentPasswordInput = document.getElementById(`${inputID}`);
  let iconBox = document.getElementById(`${spanID}`);
  if (currentPasswordInput.type === "password") {
    currentPasswordInput.type = "text";
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility.svg" alt="close-eye">`;
  } else {
    currentPasswordInput.type = "password";
    iconBox.innerHTML = `
    <img onclick="changeInputType('${inputID}', '${spanID}')" src="./assets/img/visibility_off.svg" alt="open-eye">`;
  }
}

/**
 * Logs in as a guest and redirects to the summary page.
 */
async function logInAsGuest() {
  guestLogin();

  // await setNoCurrentUser();
  // window.location.href = "./documents/summary.html";
}

async function guestLogin() {
  let currentUser = {};

  try {
    let user = await fetch(BASE_URL + "login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "guest@guest.de",
        password: "guestlogin",
      }),
    });
    if (user) {
      currentUser = await user.json();
      localStorage.setItem("token", currentUser.token);
      closeAddContactDialog();
      initialize();
    }
  } catch (error) {
    console.log("Error pushing data:", error);
  }

  if (!currentUser.non_field_errors) {
    let currentAccountName = currentUser.username;
    let currentEmail = currentUser.email;
    let currentToken = currentUser.token;
    await postCurrentUser(currentAccountName, currentEmail, currentToken, currentUser.user);
    window.location.href = `./documents/summary.html?name=${encodeURIComponent(currentAccountName)}`;
  } else {
    document.getElementById("user-email").classList.add("border-color-red");
    document.getElementById("user-password").classList.add("border-color-red");
    renderWrongLogIn();
  }
}

/**
 * Sets the current user to 'Guest' and posts this information to the server.
 * @throws {Error} Throws an error if the network request fails.
 */
async function setNoCurrentUser() {
  let userName = "Guest";
  if (userName) {
    document.getElementById("wrong-log-in").classList.add("d-none");
  }
  try {
    const response = await fetch(currentUserURL + "1/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameIn: `${userName}`, emailIn: "" }),
    });
    if (!response.ok) {
      throw new Error("Error posting data");
    }
  } catch (error) {
    console.error("Error posting no current user:", error);
  }
}

/**
 * Loads the sign-up form by hiding the login form and displaying the sign-up form.
 */
function loadSignUp() {
  document.getElementById("log-in").classList.add("d-none");
  document.getElementById("sign-up").classList.remove("d-none");
  renderSignUpHTML();
}

/**
 * Checks the validity of the sign-up form and enables or disables the sign-up button accordingly.
 */
function checkFormValidity() {
  let name = document.getElementById("new-name").value;
  let email = document.getElementById("new-email").value;
  let password = document.getElementById("new-password").value;
  let confirmPassword = document.getElementById("check-new-password").value;
  let checkbox = document.getElementById("accept-box").checked;
  let button = document.getElementById("sign-up-button");

  if (name && email && password && confirmPassword && checkbox) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

/**
 * Switches the view from the sign-up page back to the login page.
 */
function BackToLogIn() {
  document.getElementById("join-image-id").classList.remove("log-in-join-logo");
  document.getElementById("join-image-id").classList.add("static-logo");
  document.getElementById("sign-up").classList.add("d-none");
  document.getElementById("log-in").classList.remove("d-none");
}

/**
 * Handles the addition of a new user by preventing the default form submission,
 * comparing passwords, and retrieving input values.
 * @param {Event} event - The event object representing the form submission.
 */
function addNewUser(event) {
  event.preventDefault();
  let newName = document.getElementById("new-name").value;
  let newEmail = document.getElementById("new-email").value;
  let newPassword = document.getElementById("new-password").value;
  let checkNewPassword = document.getElementById("check-new-password").value;
  
  getInputValues(newName, newEmail, newPassword, checkNewPassword);

}

/**
 * Prepares and sends the input values for a new contact to the server.
 * @param {string} contactName - The name of the new contact.
 * @param {string} contactEmail - The email of the new contact.
 * @param {string} newPassword - The password of the new contact.
 */
function getInputValues(contactName, contactEmail, newPassword, repeated_password) {
  inputData = {
    username: contactName,
    email: contactEmail,
    password: newPassword,
    repeated_password: repeated_password,
  };
  pushData(inputData);
}

/**
 * Sends the contact data to the server.
 * @param {Object} inputData - The contact data to be sent.
 * @throws {Error} Throws an error if the network request fails.
 */
async function pushData(inputData) {
  try {
    let response = await fetch(BASE_URL + "registration/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    currentUser = await response.json();
    if (!response.ok) {
      throw new Error("Error pushing data");
    }
    postNewAccount(currentUser.username, currentUser.email);
    initialize();
  } catch (error) {
    console.log("Error pushing data:", error);
  }
}

/**
 * Generates a random color in hexadecimal format.
 * @returns {string} The generated color in hexadecimal format.
 */
function getRandomColor() {
  let randomNumber = Math.floor(Math.random() * 16777215);
  let randomColor = "#" + randomNumber.toString(16).padStart(6, "0");
  return randomColor;
}

/**
 * Compares the new password with the confirmed password and proceeds to post the new account if they match.
 * @param {string} newName - The name of the new user.
 * @param {string} newEmail - The email of the new user.
 * @param {string} newPassword - The password of the new user.
 * @param {string} checkNewPassword - The confirmed password to compare.
 */
function comparePasswords(newName, newEmail, newPassword, checkNewPassword) {
  if (newPassword === checkNewPassword) {
    postNewAccount(newName, newEmail, newPassword);
  } else {
    document.getElementById("check-new-password").classList.add("border-color-red");
    renderWrongPassword();
  }
}

/**
 * Opens the privacy policy page in a new tab.
 */
function sendToPrivacyPolicy() {
  let noMember = true;
  window.open(`../join/documents/Privacy.html?userId=${noMember}`, "_blank");
}

/**
 * Opens the legal notice page in a new tab.
 */
function sendTolegalNotice() {
  let noMember = true;
  window.open(`../join/documents/legal.html?userId=${noMember}`, "_blank");
}

/**
 * Posts a new account to the server and redirects to the index page after a success message is displayed.
 * @param {string} newName - The name of the new account.
 * @param {string} newEmail - The email of the new account.
 * @param {string} newPassword - The password of the new account.
 */
async function postNewAccount(newName, newEmail) {
  console.log(currentUser.token);
  debugger;
  await fetch(BASE_URL + "contacts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: currentUser.token ? `Token ${currentUser.token}` : "",
    },

    body: JSON.stringify({
      nameIn: `${newName}`,
      emailIn: `${newEmail}`,
      phoneIn: "0",
      isUser: true,
      color: "blue",
      user: [+currentUser.user],
    }),
  });
  renderSuccessfully();
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 2000);
}

/**
 * Displays a success message indicating that the user has signed up successfully.
 */
function renderSuccessfully() {
  document.getElementById("successfully").classList.remove("d-none");
  document.getElementById("successfully").classList.add("sign-up-overlay");
  return (document.getElementById("successfully").innerHTML += `
  <div id="sign-up-overlay" class="success-overlay"></div>
  <div class="success-box">You Signed Up successfully</div>
  `);
}

/**
 * Displays an error message when the passwords do not match.
 */
function renderWrongPassword() {
  document.getElementById("wrong-password").innerHTML = `Your passwords don't match. Please try again.`;
}

function renderSignUpHTML() {
  return (document.getElementById("sign-up").innerHTML = `
  <img class="static-logo" src="./assets/img/join-icon.svg" alt="">
  <div class="log-in-container">
    <div class="sign-in-title-container">
      <img onclick="BackToLogIn()" class="sign-up-arrow" src="./assets/img/arrow-left-line.svg" alt="">
      <h2>Sign up</h2>
    </div>
    <div class="border-bottom-log-in"></div>
    <form onsubmit="addNewUser(event)">
      <input id="new-name" class="input-field name-input" type="text" required placeholder="Name" oninput="checkFormValidity()">
      <input id="new-email" class="input-field email-input" type="email" required placeholder="Email" oninput="checkFormValidity()">
      <div class="input-container">
        <input id="new-password" class="input-field password-input" type="password" minlength="6" required placeholder="Password" onkeyup="changePasswordIcon('new-password','span-password-icon')" oninput="checkFormValidity()">
        <span id="span-password-icon" class="password-eye-open d-none"></span>
      </div>
      <div class="input-container">
        <input id="check-new-password" class="input-field password-input" type="password" minlength="6" required placeholder="Confirm Password" onkeyup="changePasswordIcon('check-new-password','span-check-password-icon')" oninput="checkFormValidity()">
        <span id="span-check-password-icon" class="password-eye-open d-none"></span>
      </div>
      <div id="wrong-password" class="font-color-red"></div>
      <div class="check-box-container check-box">
        <input type="checkbox" required id="accept-box" onchange="checkFormValidity()">
        <label for="checkbox">I accept the</label><a onclick="sendToPrivacyPolicy()" href="#">Privacy policy</a>
      </div>
      <button disabled class="button log-in-button" id="sign-up-button">Sign up</button>
    </div>
    </form>
    <div class="log-in-link-container">
      <a id="privacy-link" onclick="sendToPrivacyPolicy()" href="#">Privacy Policy</a>
      <a id="legal-link" onclick="sendTolegalNotice()" href="#">Legal notice</a>
    </div>
    <div id="successfully" class="d-none"></div>`);
}
