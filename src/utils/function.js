function sendNotification(message, user) {
    document.onvisibilitychange = ()=> {
        if(document.hidden) {
            const notification = new Notification("There is new notification open web to view", {
                icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
                body: `@${user}: ${message}`
            })
            notification.onclick = ()=> function() {
                window.open("http://localhost:3000")
            }
        }
    }
}

export default function checkPageStatus(message, user) {
    if(user === sessionStorage.getItem("email")) {
        if(!("Notification" in window)) {
            alert("This browser does not support system notifications!")
        } else if(Notification.permission === "granted") {
            sendNotification(message, user)
        }else if(Notification.permission !== "denied") {
            Notification.requestPermission((permission)=> {
                if (permission === "granted") {
                    sendNotification(message, user)
                }
            })
        }
    }
}