const myElement = document.getElementById("message");
//login function
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
        showProfile(username);
      } else if (result.message.includes("Wrong password. Please try again.")) {
        myElement.classList.add("error-message");
      }
      myElement.innerText = result.message;
    })
    .catch((error) => console.log("error", error));
}

//sign up function
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

//clear message tag
function clearMessage() {
  myElement.classList = [];
  myElement.innerText = "";
}

//DarkMode code
const darkModeButton = document.getElementById("dark-mode");

darkModeButton.addEventListener("click", function() {
  // Get the current value of the dark mode class on the body element.
  const isDarkMode = document.body.classList.contains("dark-mode");

  // Toggle the dark mode class on the body element.
  document.body.classList.toggle("dark-mode");

  // Change the text of the button to reflect the current mode.
  if (isDarkMode) {
    darkModeButton.textContent = "Enable Light Mode";
  } else {
    darkModeButton.textContent = "Enable Dark Mode";
  }
});


//Shows profile after logging in
function showProfile(username) {
  fetch("http://localhost:8080/user/" + username)
    .then(
      (response) => response.json() // responseCode = response.status;
    )
    .then((result) => {
      console.log(result);
      document.getElementById("module-1").innerHTML = "";
      const table = document.createElement("table");
      // Create a table header row and append it to the table
      const headerRow = document.createElement("tr");
      const headers = ["Username", "Name", "Phone", "Email"];
      for (let i = 0; i < headers.length; i++) {
        const headerCell = document.createElement("th");
        headerCell.textContent = headers[i];
        headerRow.appendChild(headerCell);
      }
      table.appendChild(headerRow);

      // Create a table row for each user and append it to the table

      const row = document.createElement("tr");

      const usernameCell = document.createElement("td");
      usernameCell.textContent = result.username;
      row.appendChild(usernameCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = result.name;
      row.appendChild(nameCell);

      const phoneCell = document.createElement("td");
      phoneCell.textContent = result.phoneNumber;
      row.appendChild(phoneCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = result.email;
      row.appendChild(emailCell);

      table.appendChild(row);

      // Add the table to the document body
      document.body.appendChild(table);
      const checkCoinDiv = document.createElement("div");
      const input = document.createElement("input");
      input.type = "button";
      input.value = "Check Coins";
      checkCoinDiv.classList="check-coin-button"
      input.style.backgroundColor = "darkblue";
      input.addEventListener("click", handleClick);
      // input.style.display ="flex";
      checkCoinDiv.append(input);

      // Add the onClick event listener
      

      // Add the input element to the DOM
      document.getElementById("module-1").appendChild(table)
      document.getElementById("module-1").appendChild(checkCoinDiv)
      document.getElementById("module-1").style.display = "block"
      // document.body.appendChild(checkCoinDiv);
    })
    .catch((error) => {
      showUserDetailsInputForm(username);
    });
  return;
}
function handleClick() {
  console.log("Button clicked!");
}

function showUserDetailsInputForm(username) {
  document.getElementById("module-1").innerHTML = "";
  var formDiv = document.createElement("div");
  formDiv.style.width="100%";
  var form = document.createElement("form");
  formDiv.id = "details-form";
  // form.style.marginTop = "25px";
  form.style.margin = "auto";

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
  submitButton.onclick = function () {
    saveData(username);
  };
  form.appendChild(submitButton);
  formDiv.append(form);
  // Add the form to the page
  document.getElementById("module-1").appendChild(formDiv)
  // document.body.appendChild(formDiv);
}

async function saveData(username) {
  const name = document.getElementById("name-input").value;
  const email = document.getElementById("email-input").value;
  const phone = document.getElementById("phone-input").value;
  if (!isValidName(name)) {
    alert("Please enter a valid name with two words!");
    return;
  }
  if (!isValidEmail(email)) {
    alert("Please enter a valid email id!");
    return;
  }
  if (!isValidIndianPhoneNumber(phone)) {
    alert("Please enter a valid Phone number starting with \"+91-\".");
    return;
  }
  var raw = JSON.stringify({
    username: username,
    name: name,
    email: email,
    phoneNumber: phone,
  });
  var myHeaders = new Headers();
  myHeaders.append("Origin", "origin-is-here");
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch("http://localhost:8080/user/save", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      const message = result.message;
      myElement.classList.add("success-message");
      myElement.innerText = result.message;
    })
    .catch((error) => console.log("error", error));
  console.log("Data should be saved now.");
  await sleep(2000);
  showProfile(username);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function isValidName(nameValue) {
  // Define a function to be executed when the input loses focus
  const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return nameRegex.test(nameValue);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidIndianPhoneNumber(phoneNumber) {
  // Regular expression for Indian phone numbers
  const regex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

  return regex.test(phoneNumber);
}

function enableDarkMode() {
  body.classList.add("dark-mode");
}

function enableLightMode() {
  body.classList.remove("dark-mode");
}