import React from 'react'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'

function Unverifiedmail() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        if (!user) {
            navigate('/login')
        } else if (user.verified == 1) {
            navigate('/admin')
        }
    }, [user, navigate])
    const API_URL = '/api/users/resendverification'
    const onSubmit = async (e) => {
        e.preventDefault()
        const email = user.email
        const response = await axios.post(API_URL, { email: email })
        if (response.data.error) {
            toast.error(response.data.error);
        } else {
            toast.success('Activation Mail Resent Successfuly')
        }
        console.log(response)
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
                                            <p className="text-dark font-size-22 font-family-secondary">
                                                <i className="mdi mdi-alpha-h-circle" /> <b>ADMIN</b>
                                            </p>
                                        </div>
                                        <h1 className="h5 mb-1">Please Verify Your Email Address</h1>
                                        <p className="text-muted mb-4">If you didn't recieve e-mail please check your spam folder. You can resend email if you are sure that you didn't recieve </p>
                                        <form className="user" onSubmit={onSubmit}>
                                            <div className="form-group">
                                                <input type="hidden" className="form-control form-control-user" name="email" value={user.email} />
                                            </div>
                                            <button className="btn btn-success btn-block waves-effect waves-light" type='submit' name='submit'>Resend</button>

                                        </form>
                                        <div className="row mt-4">
                                            <div className="col-12 text-center">
                                                <p className="text-muted mb-2"><span className="text-muted font-weight-medium ml-1"><Link to="/reset-password">Forgot your password?</Link></span></p>
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

export default Unverifiedmail