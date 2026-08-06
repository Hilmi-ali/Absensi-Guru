import { signOut } from "firebase/auth";

import { auth } from "../firebase/config";

import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);

    navigate("/");
  }

  return (
    <div>
      <h2>Profil</h2>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
