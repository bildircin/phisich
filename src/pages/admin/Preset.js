import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'


function Preset() {
    const API_URL = '/api/users/preset'
    const [email, setEmail] = useState({ 'newpassword': '', 'newpassword1': '' });
    const [resettoken, setResettoken] = useState("")
    const onSubmit = async (e) => {
        e.preventDefault()
        if (email.newpassword != email.newpassword1) {
            toast.error('Passwords not match')
        } else {
            const params = new URL(document.location).searchParams;
            if (params.has("rptoken")) {
                const refgec = params.get("rptoken");
                if (refgec.length > 10) {
                    const response = await axios.post(API_URL, { resettoken: refgec, newpassword: email.newpassword })
                    if (response.data.error) {
                        toast.error(response.data.error)
                    } else if (response.data.success) {
                        toast.success(response.data.success)
                    }
                    console.log(response)
                } else {
                    toast.error('There is no valid reset token')
                }
            } else {
                toast.error('There is no valid reset token')
            }
        }
    }

    const onChange = (e) => {
        setEmail((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }


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
                                            <a className="text-dark font-size-22 font-family-secondary">
                                                <b>Admin Panel</b>
                                            </a>
                                        </div>
                                        <h1 className="h5 mb-1">New Password</h1>
                                        <p className="text-muted mb-4">Enter your new password to change your password.</p>
                                        <form onSubmit={onSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail">Password</label>
                                                <input type="password" className="form-control form-control-user" name="newpassword" value={email.newpassword} onChange={onChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail">Confirm Password</label>
                                                <input type="password" className="form-control form-control-user" name="newpassword1" value={email.newpassword1} onChange={onChange} />
                                            </div>
                                            <button className="btn btn-success btn-block waves-effect waves-light" type='submit' >Change Password</button>
                                        </form>
                                        <div className="row mt-5">
                                            <div className="col-12 text-center">
                                                <p className="text-muted">Already have account?<span className="text-muted font-weight-medium ml-1"><Link to="/login">Sign In</Link></span></p>
                                            </div>
                                        </div>
                                        {/* end row */}
                                    </div> {/* end .padding-5 */}
                                </div> {/* end col */}
                            </div> {/* end row */}
                        </div> {/* end .w-100 */}
                    </div> {/* end .d-flex */}
                </div> {/* end col*/}
            </div> {/* end row */}
        </div>
    )
}

export default Preset