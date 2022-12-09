import React from 'react'
import ResponsiveAppBar from '../../components/Header';
import Footer from '../../components/Footer';
import { Outlet } from 'react-router-dom'


function Index() {
    return (
        <>  <div style={{ backgroundColor: "#FBBD17", fontFamily: "monospace" }}>
            <ResponsiveAppBar />
            <Outlet />
            <Footer />
        </div>
        </>
    )
}

export default Index