document
  .getElementById("resetForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get("token");
    console.log(token);
    axios
      .put(`http://localhost:80/api/users/resetPassword?token=${token}`, {
        newPass: newPassword,
        confirmNewPass: confirmPassword,
      })
      .then(function (response) {
        console.log(response);
        document.getElementById("response").innerHTML =
          "Response: " + response.data.message;

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch(function (err) {
        console.log(err);
        document.getElementById("response").innerHTML =
          "Error: " + err.response.data.message;
      });
  });
