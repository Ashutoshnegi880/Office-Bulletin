document
  .getElementById("emailPasswordSection")
  .addEventListener("submit", sendOtp);

function moveToNextInput(event, nextInputId) {
  const input = document.getElementById(event.target.id);

  if (input.value.length >= input.maxLength) {
    const nextInput = document.getElementById(nextInputId);
    nextInput.focus();
  }
}

function moveToPreviousInput(event, previousInputId) {
  if (event.keyCode === 8 && event.target.value.length === 0) {
    const previousInput = document.getElementById(previousInputId);
    previousInput.focus();
  }
}

function sendOtp(e) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const jsonBody = {
    email: email,
    password: password,
  };
  console.log("User Registering Sending OTP", jsonBody);
  document.getElementById("resendOtpBtn").style.display = "initial";
  axios.post("http://localhost:80/api/users/register", jsonBody).then(
    (res) => {
      document.getElementById("emailPasswordSection").style.display = "none";
      document.getElementById("otpSection").style.display = "block";
    },
    (err) => {
      const response = err.response;
      alert(response.data.message);
    }
  );
  e.preventDefault();
}

function submitOtp() {
  const email = document.getElementById("email").value;
  var otp1 = document.getElementById("otp1").value;
  var otp2 = document.getElementById("otp2").value;
  var otp3 = document.getElementById("otp3").value;
  var otp4 = document.getElementById("otp4").value;

  // Concatenate the values to form the OTP
  var otp = otp1 + otp2 + otp3 + otp4;

  if (otp.length !== 4) {
    alert("Otp should be of 4 digits");
    return;
  }

  const jsonBody = {
    email: email,
    otp: parseInt(otp),
  };
  console.log(jsonBody);

  axios.patch("http://localhost:80/api/users/verify", jsonBody).then(
    (res) => {
      window.sessionStorage.token = res.headers.token;
      window.sessionStorage.email = email;
      window.location.href = "/userDetails";
    },
    (err) => {
      console.log(err);
      alert(err.response.data.message);
    }
  );
}

function resend() {
  const email = document.getElementById("email").value;
  const jsonBody = {
    email: email,
  };

  axios.post("http://localhost:80/api/users/resendOtp", jsonBody).then(
    (res) => {
      console.log(err.response.data.message);
      alert("Otp sent to your mail");
      document.getElementById("otpBtn").style.display = "none";
    },
    (err) => {
      alert(err.response.data.message);
    }
  );
}
