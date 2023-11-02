if (window.sessionStorage.token) {
  axios({
    method: "post",
    url: "http://localhost:80/verifyToken",
    headers: {
      token: window.sessionStorage.token,
    },
  }).then(
    (result) => {},
    () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      alert("Session Expired");
      window.location.href = "/login";
    }
  );
} else {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("email");
  alert("Session Expired");
  window.location.href = "/login";
}
getUserDetails();
function getUserDetails() {
  const userid = window.sessionStorage.email;
  axios.get(`http://localhost:80/api/users/profile/${userid}`).then(
    (response) => {
      if (response.data !== "") {
        window.location.href = "/home";
      } else {
        document.getElementById("userDetailsForm").style.display = "inherit";
      }
    },
    (err) => {
      console.error(error.response.data.message);
    }
  );
}

document
  .getElementById("userDetailsForm")
  .addEventListener("submit", submitUserDetails);
function submitUserDetails(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const dob = document.getElementById("dob").value;
  const bloodgroup = document.getElementById("bloodgroup").value;
  const experience = document.getElementById("experience").value;
  const maxqualification = document.getElementById("maxqualification").value;

  const jsonBody = {
    userid: window.sessionStorage.email,
    name: name,
    age: age,
    dob: dob,
    bloodgroup: bloodgroup,
    experience: experience,
    maxqualification: maxqualification,
  };

  axios
    .post("http://localhost:80/api/users/profile", jsonBody, {
      headers: {
        token: window.sessionStorage.token,
      },
    })
    .then(
      (res) => {
        alert("User details submitted successfully!");
        window.location.href = "/home";
      },
      (err) => {
        console.log(err);
        alert("Error submitting user details");
      }
    );
}
