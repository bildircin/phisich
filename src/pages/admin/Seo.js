import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    useSettingsQuery,
    useUpdateSettingMutation
} from "../../features/settingApi"
import Button from '@mui/material/Button'
import PhotoModal from './small/PhotoModal';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 80
}));

function Seo() {
    const initialData = {
        url: "",
        title: "",
        describtion: "",
        author: "",
        keywords: "",
        logo_url: "",
        favicon_url: "",
        register_enable: 0,
        activation_enable: 0

    }

    const { data, error, isLoading, isSuccess } = useSettingsQuery();
    const [updateSetting] = useUpdateSettingMutation();
    const [siteSettings, setSiteSettings] = useState(initialData)
    const [image, setImage] = useState({ preview: '', data: '' })
    const [favImage, setFavImage] = useState({ preview: '', data: '' })
    const [photo, setPhoto] = useState({})
    const [item, setItem] = useState("")

    useEffect(() => {
        if (data) {
            setSiteSettings(data[0])
        }
    }, [data])

    const [modalIsOpen1, setIsOpen1] = React.useState(false);


    function openModal1() {
        setIsOpen1(true);
    }

    function closeModal1() {
        setIsOpen1(false);
    }

    const user = JSON.parse(localStorage.getItem('user'))
    const tok = user.token
    const bearer = 'Bearer ' + tok

    const API_URL = '/api/image/'


    const logoSubmit = async (e) => {
        e.preventDefault()

        try {
            updateSetting({ table: 'logo_url', value: photo.src }).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Setting Successfuly Changed'))
                .catch((error) => console.log(error))
        } catch (error) {
            console.log(error)
        }

    }

    const favSubmit = async (e) => {
        e.preventDefault()
        try {
            updateSetting({ table: 'favicon_url', value: photo.src }).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Setting Successfuly Changed'))
                .catch((error) => console.log(error))
        } catch (error) {
            console.log(error)
        }

    }

    const handleInputs = (e) => {
        setSiteSettings((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault();
        updateSetting({ table: "url", value: siteSettings.url })
        updateSetting({ table: "title", value: siteSettings.title })
        updateSetting({ table: "describtion", value: siteSettings.describtion })
        updateSetting({ table: "keywords", value: siteSettings.keywords })
        updateSetting({ table: "author", value: siteSettings.author }).unwrap()
            .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Setting Successfuly Changed'))
            .catch((error) => console.log(error))

    }

    const handleSelects = (e) => {
        e.preventDefault()
        setSiteSettings((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value
        }))
        updateSetting({ table: [e.target.name], value: Number(e.target.value) }).unwrap()
            .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Setting Successfuly Changed'))
            .catch((error) => console.log(error))
    }

    const openChoose = (e) => {
        e.preventDefault()
        setItem(e.target.name);
        openModal1()
    }

    return (
        <React.Fragment>
            <div className="main-content">
                <div className="container-fluid pr-5 pl-5 pb-5 pt-3">
                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">

                            <form onSubmit={onSubmit} >
                                <div className="row">
                                    <div className="form-group col-4">
                                        <label htmlFor="exampleInputEmail1">Title</label>
                                        <input type="text" className="form-control form-control-lg" name="title" aria-describedby="emailHelp" value={siteSettings.title} onChange={handleInputs} />
                                    </div>
                                    <div className="form-group col-4">
                                        <label htmlFor="exampleInputEmail1">Keywords</label>
                                        <input type="text" className="form-control form-control-lg" name="keywords" aria-describedby="emailHelp" value={siteSettings.keywords} onChange={handleInputs} />
                                    </div>
                                    <div className="form-group col-4">
                                        <label htmlFor="exampleInputEmail1">Author</label>
                                        <input type="text" className="form-control form-control-lg" aria-describedby="emailHelp" name="author" value={siteSettings.author} onChange={handleInputs} />
                                    </div>
                                </div>
                                <div className="row mt-2 mb-2">
                                    <div className="col-3">
                                        <label>Register Available</label>
                                        <select className="form-control form-control-lg" name='register_enable' value={siteSettings.register_enable} onChange={handleSelects}>
                                            <option value={1}>Yes</option>
                                            <option value={0}>No</option>
                                        </select>
                                    </div>
                                    <div className="col-3">
                                        <label>Activation Needed</label>
                                        <select className="form-control form-control-lg" name='activation_enable' value={siteSettings.activation_enable} onChange={handleSelects}>
                                            <option value={1}>Yes</option>
                                            <option value={0}>No</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-6">
                                        <label htmlFor="exampleInputEmail1">Website Url</label>
                                        <input type="text" className="form-control form-control-lg" aria-describedby="emailHelp" name="url" value={siteSettings.url} onChange={handleInputs} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-12">
                                        <label htmlFor="exampleInputEmail1">Describtion</label>
                                        <input type="text" className="form-control form-control-lg" aria-describedby="emailHelp" name="describtion" value={siteSettings.describtion} onChange={handleInputs} />
                                    </div>
                                </div>
                                <button className="btn btn-lg btn-outline-success" type='submit'>Update</button>

                            </form>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-6 mt-3 mb-3">
                            <div className="d-flex justify-content-start align-items-center">
                                <button className='btn btn-warning mt-2 mb-2 mr-2' name="logo" onClick={openChoose}>Choose Logo</button>
                                <form onSubmit={logoSubmit} action="/image" method="post" encType="multipart/form-data" className='mb-3'>
                                    <div className="form-group">
                                    </div>
                                    <button className='btn btn-outline-success' name='submit' type='submit'>Update Logo</button>

                                </form>
                            </div>

                            {photo ? 
                            (item == "logo" 
                            ? <img src={photo.src} width="200" alt='' />
                            : <img src={siteSettings.url + '/' + siteSettings.logo_url} width="200" alt='' />)
                            : <img src={siteSettings.url + '/' + siteSettings.logo_url} width='200' alt='' />}


                        </div>
                        <div className="col-6 mt-3 mb-3">
                            <div className="d-flex justify-content-start align-items-center">
                                <button className='btn btn-warning mt-2 mb-2 mr-2' name="favicon" onClick={openChoose}>Choose Favicon</button>
                                <form onSubmit={favSubmit} action="/image" method="post" encType="multipart/form-data" className='mb-3'>
                                    <div className="form-group">
                                    </div>
                                    <button className='btn btn-outline-success' name='submit' type='submit'>Update Favicon</button>
                                </form>
                            </div>
                            {photo ? (item == "favicon" 
                            ? <img src={photo.src} width='200' alt='' /> 
                            : <img src={siteSettings.url + '/' + siteSettings.favicon_url} width='200' alt='' />)
                             : <img src={siteSettings.url + '/' + siteSettings.favicon_url} width='200' alt='' />}

                        </div>
                    </div>
                    <PhotoModal modalIsOpen1={modalIsOpen1} closeModal1={closeModal1} deletePhoto={false} choosePhoto={setPhoto} closeModal={closeModal1} />
                    {/* end page title */}
                </div> {/* container-fluid */}
            </div>

        </React.Fragment>
    )
}

export default Seo