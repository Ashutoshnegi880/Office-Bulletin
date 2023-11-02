document
  .getElementById("resetPassword")
  .addEventListener("submit", generateResetPasswordLink);

function generateResetPasswordLink(e) {
  e.preventDefault();
  console.log("Inside reset function");
  const email = document.getElementById("email").value;
  const jsonBody = {
    email: email,
  };

  axios.post("http://localhost:80/api/users/generateResetLink", jsonBody).then(
    (res) => {
      alert("Reset Password Link sent to your mail");
      console.log(res.data);
    },
    (err) => {
      console.log(err);
      alert(err.response.data.message);
    }
  );
}
