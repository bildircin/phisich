import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { logout } from '../../features/auth/authSlice'


function Verifyaccount() {
    const [token, setToken] = useState(true)
    const [userMessage, setUserMessage] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const API_URL = './api/users/verify'

    const onSubmit = async () => {
        const params = new URL(document.location).searchParams;
        if (params.has("verificationtoken")) {
            const refgec = params.get("verificationtoken");
            if (refgec.length > 10) {
                setToken(refgec)
                const response = await axios.post(API_URL, { verificationtoken: refgec })
                if (response.data.error) {
                    setUserMessage(response.data.error)
                } else if (response.data.success) {
                    dispatch(logout())
                    setUserMessage('Your email has been verified please go to login page')
                } else if (response.name == "AxiosError") {
                    setUserMessage(response.message)
                }
            } else {
                setUserMessage('There is no valid verification token')
            }
        } else {
            setUserMessage('There is no valid verification token')
        }
    }

    useEffect(() => {
        onSubmit()
    }, [])



    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex align-items-center min-vh-100">
                        <div className="w-100 d-block bg-white shadow-lg rounded my-5">
                            <div className="row">
                                <div className="col-lg-5 d-none d-lg-block bg-login rounded-left" />
                                <div className="col-lg-7">
                                    <div className="p-5">
                                        <div className="text-center mb-5">
                                            <p className="text-dark font-size-22 font-family-secondary">
                                                <i className="mdi mdi-alpha-h-circle" /> <b>ADMIN</b>
                                            </p>
                                        </div>
                                        <h1 className="h5 mb-1">{userMessage}</h1>
                                        <p className="text-muted mb-2"><span className="text-muted font-weight-medium ml-1"><Link to="/login">Login</Link></span></p>

                                        <div className="row mt-4">
                                            <div className="col-12 text-center">
                                            </div> {/* end col */}
                                        </div>
                                        {/* end row */}
                                    </div> {/* end .padding-5 */}
                                </div> {/* end col */}
                            </div> {/* end row */}
                        </div> {/* end .w-100 */}
                    </div> {/* end .d-flex */}
                </div> {/* end col*/}
            </div> {/* end row */}
        </div>)
}

export default Verifyaccount