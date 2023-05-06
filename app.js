const myElement = document.getElementById("message");
function loginFunction() {
  clearMessage();
  var username = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;
  if (!username || !password) {
    myElement.innerText =
      "Your username or password is either empty or null. Please check.";
    myElement.classList.add("error-message");
  }
  var myHeaders = new Headers();
  myHeaders.append("Origin", "origin-is-here");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    username: username,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/user/login", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.message.includes("This user doesn't exist.")) {
        myElement.classList.add("neutral-message");
      } else if (result.message.includes("You've logged in.")) {
        myElement.classList.add("success-message");
      } else if (result.message.includes("Wrong password. Please try again.")) {
        myElement.classList.add("error-message");
      }
      myElement.innerText = result.message;
    })
    .catch((error) => console.log("error", error));
  showProfile(username);
}
function signupFunction() {
  clearMessage();
  var username = document.getElementById("signupUsername").value;
  var password = document.getElementById("signupPassword").value;
  var passwordCheck = document.getElementById("signupPasswordCheck").value;
  if (!username || !password || !passwordCheck) {
    myElement.innerText =
      "Your username or password is either empty or null. Please check.";
    myElement.classList.add("error-message");
    return;
  }
  if (!isValidUsername(username)) {
    myElement.classList.add("error-message");
    myElement.innerText =
      "This username is not correct. Username can only be alphabets and numerics.";
    document.getElementById("signupUsername").value = "";
    document.getElementById("signupUsername").focus();
    return;
  }
  if (!isValidPassword(password)) {
    myElement.classList.add("error-message");
    myElement.innerText =
      "The password has to be 8 to 15 in length with mix of at least 1 upper, 1 lower, 1 digit and 1 special character";
    document.getElementById("signupPassword").value = "";
    document.getElementById("signupPasswordCheck").value = "";
    document.getElementById("signupPassword").focus();
    return;
  }
  if (password != passwordCheck) {
    myElement.classList.add("error-message");
    myElement.innerText = "Provided passwords don't match.";
    document.getElementById("signupPassword").value = "";
    document.getElementById("signupPasswordCheck").value = "";
    document.getElementById("signupPassword").focus();
    return;
  }
  myElement.classList.add("success-message");
  myElement.innerText = "Success!!";
  var myHeaders = new Headers();
  myHeaders.append("Origin", "origin-is-here");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    username: username,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch("http://localhost:8080/user/signup", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const message = result.message;
      myElement.classList.add("neutral-message");
      myElement.innerText = result.message;
    })
    .catch((error) => console.log("error", error));
}
function clearMessage() {
  myElement.classList = [];
  myElement.innerText = "";
}

function isValidUsername(username) {
  var pattern = /^[a-zA-Z0-9]{4,15}$/;
  return pattern.test(username);
}

function isValidPassword(password) {
  var pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,15}$/;
  return pattern.test(password);
}

const toggleBtn = document.getElementById("toggle");
const body = document.body;
let isDarkMode = false;

toggleBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    enableDarkMode();
  } else {
    enableLightMode();
  }
});

function enableDarkMode() {
  body.classList.add("dark-mode");
}

function enableLightMode() {
  body.classList.remove("dark-mode");
}

function showProfile(username) {
  let responseCode = "";
  fetch("http://localhost:8080/user/" + username)
    .then((response) => {
      response.json();
      responseCode = response.status;
    })
    .then((result) => {
      document.getElementById("main").innerHTML = "";
      if (responseCode == 404) {
        // Create a new form element
        var form = document.createElement("form");
        form.style.marginTop = "10%";
        form.style.padding = "auto";

        // Add a label and input for name
        var nameLabel = document.createElement("label");
        nameLabel.textContent = "Name:";
        var nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = "name-input";
        nameInput.name = "name";
        nameInput.required = true;
        nameLabel.appendChild(nameInput);
        form.appendChild(nameLabel);

        // Add a label and input for email
        var emailLabel = document.createElement("label");
        emailLabel.textContent = "Email:";
        var emailInput = document.createElement("input");
        emailInput.type = "text";
        emailInput.id = "email-input";
        emailInput.name = "email";
        emailInput.required = true;
        emailLabel.appendChild(emailInput);
        form.appendChild(emailLabel);

        // Add a label and input for phone number
        var phoneLabel = document.createElement("label");
        phoneLabel.textContent = "Phone Number:";
        var phoneInput = document.createElement("input");
        phoneInput.type = "text";
        phoneInput.id = "phone-input";
        phoneInput.name = "phone";
        phoneInput.required = true;
        phoneLabel.appendChild(phoneInput);
        form.appendChild(phoneLabel);

        // Add a submit button
        var submitButton = document.createElement("input");
        submitButton.id = "details-submit-button";
        submitButton.type = "button";
        submitButton.value = "Submit";
        // submitButton.onClick = "saveData()";
        form.appendChild(submitButton);

        // Add the form to the page
        document.body.appendChild(form);
      } else {
        // var mainDiv = document.createElement();
        // mainDiv.style.marginTop = "10%";
        // mainDiv.style.padding = "auto";
      }
    })
    .catch((error) => console.log("error", error));
  return;
}
document
  .getElementById("details-submit-button")
  .addEventListener("click", function () {
    console.log("bhai ye chala");
    var raw = JSON.stringify({
      username: username,
      name: document.getElementById("name-input").value,
      email: document.getElementById("email-input").value,
      phoneNumber: document.getElementById("phone-input").value,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:8080/user/save", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const message = result.message;
        myElement.classList.add("success-message");
        myElement.innerText = result.message;
      })
      .catch((error) => console.log("error", error));
  });
