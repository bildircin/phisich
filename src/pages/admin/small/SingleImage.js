import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    useGalleryQuery,
    useAddGalleryMutation,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation
} from "../../../features/galleryApi"
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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


function SingleImage({ addModal, currentPhoto, closeModal }) {
    var _URL = window.URL || window.webkitURL;
    const { data, error, isLoading, isSuccess } = useGalleryQuery();
    const [addGallery] = useAddGalleryMutation()
    const [updateGallery] = useUpdateGalleryMutation()
    const [index, setIndex] = useState(-1)
    const [image, setImage] = useState({ preview: '', data: '' })
    const [element, setElement] = useState({ id: '', link: '', alt: '', name: '', width: '', height: '' })
    const user = JSON.parse(localStorage.getItem('user'))
    const tok = user.token
    const bearer = 'Bearer ' + tok

    const API_URL = 'https://phics.uncw3b.com/api/image/'

    const onChange = (e) => {
        setElement((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const handleFileChange = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
        const image = new Image();

        image.onload = function () {
            setElement((prev) => ({ ...prev, width: this.width, height: this.height }));
            _URL.revokeObjectURL(img.preview);
        };
        image.src = img.preview;
    }

    useEffect(() => {
        if (!addModal) {
            setElement(currentPhoto)
        }
    }, [currentPhoto])

    const onSubmit = (e) => {
        if (!addModal) {
            upDateImage(e)
            closeModal()
        } else {
            logoSubmit(e)
            closeModal()
        }
    }



    const logoSubmit = async (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file', image.data)
        if (image.data) {

            try {
                const response = await axios.post(API_URL, formData, {
                    headers: {
                        Authorization: bearer,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (response && response.status == 200) {
                    const newEl = { ...element, link: response.data.data.filename }
                    addGallery(newEl).unwrap()
                        .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Image added successfuly'))
                        .catch((error) => console.log(error))


                }

            } catch (error) {
                console.log(error)
            }
        } else {
            toast.error("Image can't be empty")
        }

    }

    const upDateImage = async (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file', image.data)
        if (image.data) {

            try {
                const response = await axios.post(API_URL, formData, {
                    headers: {
                        Authorization: bearer,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (response && response.status == 200) {
                    const newEl = { link: response.data.data.filename, alt: element.alt, name: element.name, width: element.width, height: element.height, id: element.id }
                    updateGallery(newEl).unwrap()
                        .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Image changed successfuly'))
                        .catch((error) => console.log(error))
                }

            } catch (error) {
                console.log(error)
            }
        } else {
            updateGallery(element).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Image info updated successfuly'))
                .catch((error) => console.log(error))
        }
    }




    if (isLoading) {
        return (<h1>Loading</h1>)
    }
    return (
        <div className="main-content">
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-3 mb-3">


                        <form onSubmit={onSubmit} action="/image" method="post" encType="multipart/form-data">

                            <div className="form-group">
                                <TextField id="outlined-basic" sx={{ width: 100 + '%', mt: 3 }} label="Image Name" required={true} name="name" variant="outlined" onChange={onChange} value={element.name} />
                            </div>
                            <div className="form-group">
                                <TextField id="outlined-basic" sx={{ width: 100 + '%', mt: 3, mb: 3 }} label="Alt Name" required={true} name="alt" variant="outlined" onChange={onChange} value={element.alt} />
                            </div>
                            <div className="form-group">
                                <input type="file" name="logo_url" className="form-control form-control-lg" aria-describedby="emailHelp" onChange={handleFileChange} />
                            </div>
                            <button className='btn btn-outline-success mt-3' name='submit' type='submit'>{addModal ? 'Upload Image' : 'Update Image'}</button>

                        </form>
                        {!addModal ? <div className='mt-2 mb-2'><h1 className='mb-2'>Current Image</h1>{currentPhoto ? <img src={currentPhoto.src} width='300' alt='' /> : null} </div> : null}
                        {image.preview ? <div className='mt-2 mb-2'><h1 className='mb-2'>New Image</h1><img src={image.preview} width='300' alt='' /></div> : null}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleImage