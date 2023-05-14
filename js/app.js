const myElement = document.getElementById("message");
const coinList = ["ADA", "ATOM", "BCH", "BNB", "BTC"];
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

darkModeButton.addEventListener("click", function () {
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
      const actualbutton = document.createElement("input");
      actualbutton.type = "button";
      actualbutton.value = "Check Coins";
      checkCoinDiv.classList = "check-coin-button";
      actualbutton.id = "check-coin-button";
      actualbutton.style.backgroundColor = "darkblue";
      actualbutton.onclick = function () {
        fetch("http://localhost:8080/user/" + username, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => {
            myElement.classList.add("error-message");
            myElement.innerText = "Invalid call!!";
          });
        showModule2();
      };
      checkCoinDiv.appendChild(actualbutton);
      document.getElementById("module-1").appendChild(table);
      document.getElementById("module-1").appendChild(checkCoinDiv);
      document.getElementById("module-1").style.display = "block";
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
  formDiv.style.width = "100%";
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
  document.getElementById("module-1").appendChild(formDiv);
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
    alert('Please enter a valid Phone number starting with "+91-".');
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
const corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
const options = {
  headers: {
    "X-CMC_PRO_API_KEY": "27ab17d1-215f-49e5-9ca4-afd48810c149",
  },
};
function showModule2() {
  document.getElementsByClassName("toggle-mode")[0].style.display = "none";
  document.getElementById("message").style.display = "none";
  document.getElementById("module-1").style.display = "none";
  document.getElementById("module-2").style.display = "block";
  document.body.style.backgroundColor = "rgb(70, 69, 69)";
  document.getElementsByClassName("lower-header-right")[0].innerHTML =
    "Count : " + coinList.length;
  coinList.forEach((element) => {
    fetch(
      corsAnywhereUrl +
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" +
        element,
      options
    )
      .then((response) => response.json())
      .then((sampleResponse) => {
        const mainCard = document.createElement("div");
        mainCard.classList = ["main-card"];
        const innerUpperDiv = document.createElement("div");
        innerUpperDiv.classList = ["inner-upper-div"];
        mainCard.appendChild(innerUpperDiv);
        const upperLeftDiv = document.createElement("div");
        upperLeftDiv.classList = ["upper-left-div"];
        innerUpperDiv.appendChild(upperLeftDiv);
        const coinName = document.createElement("div");
        coinName.classList = ["coin-name"];
        coinName.innerHTML =
          sampleResponse.data[element].name + "&nbsp;&nbsp;&nbsp;";
        upperLeftDiv.appendChild(coinName);
        const dailyChange = document.createElement("div");
        dailyChange.classList = ["daily-change"];
        const arrowImage = document.createElement("img");
        arrowImage.classList = ["arrow"];
        arrowImage.style.height = "20px";
        const changeValue =
          sampleResponse.data[element].quote.USD.percent_change_24h.toFixed(2);
        if (changeValue > 0) {
          arrowImage.src = "/images/arrow-small-up.png";
        } else {
          arrowImage.src = "/images/arrow-small-down.png";
        }
        const coinChangeValue = document.createElement("div");
        coinChangeValue.classList = ["24h-change-value"];
        coinChangeValue.innerHTML = changeValue + "%";
        dailyChange.appendChild(arrowImage);
        dailyChange.appendChild(coinChangeValue);
        upperLeftDiv.appendChild(dailyChange);
        const upperRightDiv = document.createElement("div");
        upperRightDiv.classList = ["upper-right-div"];
        upperRightDiv.innerHTML = sampleResponse.data[element].symbol;
        innerUpperDiv.appendChild(upperRightDiv);
        const innerLowerDiv = document.createElement("div");
        innerLowerDiv.classList = ["inner-lower-div"];
        const lowerFirst = document.createElement("div");
        lowerFirst.classList = ["lower-first"];
        const element1 = document.createElement("div");
        element1.innerHTML = "Price &nbsp;$";
        const priceValue = document.createElement("div");
        priceValue.classList = ["price-value"];
        priceValue.innerHTML =
          sampleResponse.data[element].quote.USD.price.toFixed(2);
        lowerFirst.appendChild(element1);
        lowerFirst.appendChild(priceValue);
        const lowerMiddle = document.createElement("div");
        lowerMiddle.classList = ["lower-middle"];
        const element2 = document.createElement("div");
        element2.innerHTML = "Rank &nbsp;";
        const rankValue = document.createElement("div");
        rankValue.classList = ["rank-value"];
        rankValue.innerHTML = sampleResponse.data[element].cmc_rank;
        lowerMiddle.appendChild(element2);
        lowerMiddle.appendChild(rankValue);
        const lowerEnd = document.createElement("div");
        lowerEnd.classList = ["lower-end"];
        const finalImage = document.createElement("img");
        finalImage.src = "/images/arrow-circle-right.png";
        finalImage.style.height = "30px";
        lowerEnd.appendChild(finalImage);
        innerLowerDiv.appendChild(lowerFirst);
        innerLowerDiv.appendChild(lowerMiddle);
        innerLowerDiv.appendChild(lowerEnd);
        mainCard.appendChild(innerLowerDiv);
        document.body.appendChild(mainCard);
      })
      .catch((error) => console.log(error));
  });
}
