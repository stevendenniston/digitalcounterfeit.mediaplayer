import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuLayout from "./MenuLayout";
import ArtistList from "./ArtistList";

const App = () => {  

  const {user} = useAuth0();

  return (
    <>
      <BrowserRouter basename="/">
        <MenuLayout>
            <Routes>
              <Route path="/" element={null}/>
              <Route path="/user-profile" element={<pre>{JSON.stringify(user, null, 2)}</pre>}/>
              <Route path="/user-settings" element={<pre>User Settings</pre>}/>
              <Route path="/music-library" element={<ArtistList />}/>
            </Routes>
        </MenuLayout>
      </BrowserRouter>      
    </>
  )
}

export default withAuthenticationRequired(App);