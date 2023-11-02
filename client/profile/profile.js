if (window.sessionStorage.token) {
    axios({
      method: "post",
      url: "http://localhost:80/verifyToken",
      headers: {
        token: window.sessionStorage.token,
      },
    }).then(
      (result) => {
        if(!result.data){
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("email");
          alert("Session Expired");
          window.location.href = "/login";
        }
      },
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
  
  getProfile();
  function getProfile() {
    const url = window.location.href;
    const userid = url.split("/").pop();
  
    axios
      .get(`http://localhost:80/api/users/profile/${userid}`)
      .then((response) => {
        const profile = response.data;
        const container = document.createElement("div");
        container.classList.add("container");
        const dob = moment(profile.dob).format("DD MMMM YYYY");
  
        container.innerHTML = `
                      <div class="col-lg-4">
                          <div class="card">
                              <div class="card-body">
                                  <div class="d-flex flex-column align-items-center text-center">
                                      <div class="mt-3">
                                          <h4>${profile.name}</h4>
                                          <p class="text-secondary mb-1">${profile.userid}</p>
                                      </div>
                                  </div>
                                  <hr class="my-4">
                                  <ul class="list-group list-group-flush">
                                      <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                          <h6 class="mb-0">Max Qualification</h6>
                                          <span class="text-secondary">${profile.maxqualification}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                          <h6 class="mb-0">Date of Birth</h6>
                                          <span class="text-secondary">${dob}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                          <h6 class="mb-0">Experience</h6>
                                          <span class="text-secondary">${profile.experience}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                          <h6 class="mb-0">Blood Group</h6>
                                          <span class="text-secondary">${profile.bloodgroup}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                          <h6 class="mb-0">Age</h6>
                                          <span class="text-secondary">${profile.age}</span>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      `;
        document.getElementById("newContainer").appendChild(container);
      });
  }
  
  document.getElementById("userNameSpan").innerText = extractUsername(
    window.sessionStorage.email
  );
  
  document.getElementById("userNameSpan").addEventListener("click", function () {
    window.location.href = `http://localhost:80/profile/${window.sessionStorage.email}`;
  });
  
  document.getElementById("logout").addEventListener("click", function () {
    window.sessionStorage.clear();
    document.getElementById("modal-inner-text").innerText = `Loggin Out...`;
    $("#myModal").modal("show");
  
    setTimeout(() => {
      window.location.href = `http://localhost:80/`;
    }, 2000);
  });
  
  function extractUsername(email) {
    // Use the split method to separate the email into two parts
    console.log(email);
    if (!email) {
      window.sessionStorage.clear();
      console.log("Set modal-inner-txt");
      document.getElementById("modal-inner-text").innerText = `Redirecting...`;
      $(document).ready(function () {
        // Your Bootstrap-related code here
        $("#myModal").modal("show");
        setTimeout(() => {
          window.location.href = `http://localhost:80/`;
        }, 1000);
      });
    } else {
      var parts = email.split("@");
  
      // The first part (parts[0]) will be the username
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    }
  }
  