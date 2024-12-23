import { SignInForm } from "./public/signIn/components";
import { SignUpForm } from "./public/signUp/components";
import { EditProfile } from "./private/user/components/editProfile/EditProfile";
import { Main } from "./private/main/components";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignInForm />}></Route>
          <Route path="/sign-up" element={<SignUpForm />}></Route>
          <Route path="/home" element={<Main />}></Route>
          <Route path="/edit-profile" element={<EditProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
