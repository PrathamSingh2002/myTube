"use client"
import withAuth from "@/components/auth"
import AddUser from "@/components/addUser";
function Notification(){
    return (
        <div>Notifications</div>
    )
}
export default withAuth(AddUser(Notification));