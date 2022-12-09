import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from 'react-modal';
import {
    useEmailSettingsQuery,
    useUpdateEmailSettingMutation,
    useTestEmailSettingMutation,
} from "../../features/emailSettingsApi"
import { customStyles, mobileStyles } from './small/modalStyles'
import Form from 'react-bootstrap/Form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';




function Emailsettings() {
    const [modalIsOpen, setIsOpen] = React.useState(false);


    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }



    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement('#root');


    const { data, error, isLoading, isSuccess } = useEmailSettingsQuery();
    const [updateEmailSetting] = useUpdateEmailSettingMutation();
    const [testEmailSetting] = useTestEmailSettingMutation();

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [emails, setEmails] = useState({ server: '', port: '', email: '', password: '', secure: "" })

    const [isChecked, setisChecked] = useState("")



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(emails)
        updateEmailSetting(emails).unwrap()
            .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Settings Updated'))
            .catch((error) => console.log(error))
        closeModal()
    }

    useEffect(() => {
        if (data) {
            setEmails(data)
            console.log(data)
            const check = data.secure == 0 ? false : true
            setisChecked(check)
        }
    }, [data])

    const onChange = (e) => {
        setEmails((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

    }

    const checkedChange = (e) => {
        setisChecked(!isChecked)
        setEmails((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.checked,
        }))
    }

    return (
        <>
            <div className="main-content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <h5 className="card-header">Email Settings</h5>
                            <div className="card-body">
                                <div className="row text-center">
                                    <div className="col-md-3">
                                        <h3 className='font-weight-bold'>Mail Server</h3>
                                        <h4>{emails.server}</h4>
                                    </div>
                                    <div className="col-md-2">
                                        <h3 className='font-weight-bold'>Port</h3>
                                        <h4>{emails.port}</h4>
                                    </div>
                                    <div className="col-md-3">
                                        <h3 className='font-weight-bold'>Address</h3>
                                        <h4>{emails.email}</h4>
                                    </div>
                                    <div className="col-md-2">
                                        <h3 className='font-weight-bold'>Password</h3>
                                        <h4>{emails.password}</h4>
                                    </div>
                                    <div className="col-md-2">
                                        <h3 className='font-weight-bold'>SSL/TLS</h3>
                                        <input type="checkbox" className="form-control form-control-sm" aria-describedby="emailHelp" checked={isChecked ? true : false} name="secure" readOnly />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-12 mt-5 ml-3'>
                                        <button className="btn btn-primary waves-effect waves-light" onClick={openModal}>Edit Settings</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={matches ? mobileStyles : customStyles}
                contentLabel="Example Modal"
            >

                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email_name">Name</label>
                            <input type="text" className="form-control" id="email_name" aria-describedby="emailHelp" value={emails.server} name="server" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_link">Link</label>
                            <input type="text" className="form-control" id="email_link" aria-describedby="emailHelp" value={emails.port} name="port" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_email">Email</label>
                            <input type="text" className="form-control" id="email_email" aria-describedby="emailHelp" value={emails.email} name="email" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_password">Password</label>
                            <input type="password" className="form-control" id='email_password' aria-describedby="emailHelp" value={emails.password} name="password" onChange={onChange} />
                        </div>
                        <div className="mb-2 mt-2">
                            <label htmlFor="secured_connection">Secured Connection</label>
                            <input type="checkbox" id="secured_connection" style={{width:'20px', height:'20px', margiLeft:'20px', transform:'scale(1) translate(0%, 20%)'}} aria-describedby="emailHelp" checked={isChecked} name="secure" onChange={checkedChange} />
                        </div>
                        <button type="submit" className="btn btn-outline-primary mb-2">{'Update Settings'}</button>

                    </form>
                </div>

            </Modal>
        </>

    )
}

export default Emailsettings