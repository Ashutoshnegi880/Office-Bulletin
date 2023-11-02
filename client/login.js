if(window.sessionStorage.token){
      axios({
          method: "post",
          url: "http://localhost:80/verifyToken",
          headers:{
              token:window.sessionStorage.token
          }
      }).then(
          (result)=>{
              if(result.data){
                  window.location.href = '/userDetails'
              }else{
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("email");
                  alert("Session Expired");
                  window.location.href = "/login";
              }
          }
      ) 
  }

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const jsonBody = {
    email: email,
    password: password,
  };

  axios.post("http://localhost:80/api/users/login", jsonBody).then(
    (res) => {
      window.sessionStorage.token = res.headers.token;
      window.sessionStorage.email = email;
      window.location.href = "/home";
    },
    (err) => {
      console.log(err);
      alert(err.response.data.message)
    }
  );
}

function resetPassword() {
  window.location.href = "/generateResetLink"
}