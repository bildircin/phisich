import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Waiting from '../../components/Waiting'
import { login, reset } from '../../features/auth/authSlice'

function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { name, email, password, password2 } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)


    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            navigate('/admin')
        }
        if (user) {
            if (user.token) {
                navigate('/admin')
            }

        }
        console.log(isError)
        console.log(isSuccess)
        console.log(user)
        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

    if (isLoading) {
        return <Waiting />
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
                                                <b>Admin Panel</b>
                                            </p>
                                        </div>
                                        <h1 className="h5 mb-1">Welcome Back!</h1>
                                        <p className="text-muted mb-4">Enter your email address and password to access admin panel.</p>
                                        <p>{ isError ? isError : null }</p>
                                        <form className="user" onSubmit={onSubmit}>
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user" id="email" name="email" placeholder="Email Address" value={email} onChange={onChange} />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control form-control-user" id="password" name="password" placeholder="Password" value={password} onChange={onChange} />
                                            </div>
                                            <button className="btn btn-outline-success btn-block waves-effect waves-light" type='submit'> Log In </button>
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
        </div>
    )
}

export default Login