const socket = io();

socket.emit("seeing-blogs", {
    email: window.sessionStorage.email,
  });
function likePost(postid) {
    const liked = localStorage.getItem(`postid_${postid}`) === "true";
    let likeCount = document.getElementById(`likesCount_${postid}`).innerText;
    likeCount = +likeCount + 1
        document.getElementById(`likesCount_${postid}`).innerText = likeCount;
    // if (liked) {
    //     likeCount = +likeCount + 1
    //     document.getElementById(`likesCount_${postid}`).innerText = likeCount;
    //     localStorage.setItem(`postid_${postid}`, "false");
    // } else {
    //     likeCount = +likeCount - 1
    //     document.getElementById(`likesCount_${postid}`).innerText = likeCount;
    //     localStorage.setItem(`postid_${postid}`, "true");
    // }


    //Emmit like post
    const postOwner = document.getElementById(`email_${postid}`).innerText;
    axios({
        method:"put",
        url: "http://localhost:80/api/blog/likedPost",
        headers:{
            token: sessionStorage.token
        },
        data:{
            email: postOwner,
            likeCount: likeCount,
            postid: postid
        }
    }).then(
        (result)=>{
            if(window.sessionStorage.email === recieverEmail){
                return
            }
            socket.emit('liked',{
                senderEmail: window.sessionStorage.email, 
                recieverEmail: postOwner
            })
            console.log("Post liked and updated successfully")
        },
        (error)=>{
            console.log(error)
        }
    )
}

socket.on("likedNotification",(msg)=>{
    alert(`${msg.senderEmail} liked your post`);
})
