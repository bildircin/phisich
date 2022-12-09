import Sidebar from "./components/Sidebar";
import Adminindex from "./pages/Adminindex";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/home/Index";
import Seo from "./pages/admin/Seo";
import Adminpages from "./pages/admin/Adminpages";
import Login from "./pages/admin/Login"
import Pwreset from "./pages/admin/Pwreset";
import Users from "./pages/admin/Users";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Social from "./pages/admin/Social";
import Unverifiedmail from "./pages/admin/Unverifiedmail";
import Verifyaccount from "./pages/admin/Verifyaccount";
import Preset from "./pages/admin/Preset";
import Emailsettings from "./pages/admin/Emailsettings";
import Gallery from "./pages/admin/Gallery";
import Modal from 'react-modal';
import Menu from "./pages/admin/Menu";
import Stakebody from "./components/Stakebody";
import Box from '@mui/material/Box';
import SingleAirdrop from "./components/SingleAirdrop";
import Airdrop from "./components/Airdrop";
import Airdropadmin from "./components/Airdropadmin";
import Addairdrop from "./pages/admin/Addairdrop";








function App() {

  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/" element={<Index />}>
            <Route path="/stake" element={
              <Box align="center">
                <Stakebody />
              </Box>

            } />
            <Route path="airdrop" element={<Airdrop />} />
            <Route path="airdrop/:airdropcontractadresi" element={<SingleAirdrop />} />
            <Route path="/airdropadmin" element={<Airdropadmin />} />
          </Route>
          <Route path="/admin" element={<Adminpages />}>
            <Route index element={<Adminindex />} />
            <Route path="/admin/settings" element={<Seo />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path='/admin/socials' element={<Social />} />
            <Route path='/admin/email' element={<Emailsettings />} />
            <Route path='/admin/gallery' element={<Gallery />} />
            <Route path='/admin/menus' element={<Menu />} />
            <Route path='/admin/add' element={<Addairdrop />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<Pwreset />} />
          <Route path="/verify-email" element={<Unverifiedmail />} />
          <Route path="/verifyaccount" element={<Verifyaccount />} />
          <Route path="/new-password" element={<Preset />} />

        </Routes>
        <ToastContainer />
      </BrowserRouter>




    </>
  );
}

export default App;
