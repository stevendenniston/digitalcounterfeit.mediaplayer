import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ArtistList from "./ArtistList";
import Artist from "./Artist";
import Album from "./Abum";

const App = () => {  

  const {user} = useAuth0();

  return (
    <>
      <BrowserRouter basename="/">
        <Layout>
            <Routes>
              <Route path="/" element={null}/>
              <Route path="/user-profile" element={<pre>{JSON.stringify(user, null, 2)}</pre>}/>
              <Route path="/user-settings" element={<pre>User Settings</pre>}/>
              <Route path="/music-library" Component={ArtistList}/>
              <Route path="/artist/:artistId" Component={Artist}/>
              <Route path="/album/:albumId" Component={Album}/>
            </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default withAuthenticationRequired(App);