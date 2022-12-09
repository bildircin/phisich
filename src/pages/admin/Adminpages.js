import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Adminpages() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        if (user) {
            if (!user.token) {
                navigate('/login')
            } else if (user.verified && user.verified != 1) {
                navigate('/verify-email')
            }
        } else {
            navigate('/login')
        }

    }, [user, navigate])
    return (
        <>
            <div id="layout-wrapper">
                <Sidebar />

                <Outlet />
            </div>
            <div className="menu-overlay" />
        </>

    )
}

export default Adminpages