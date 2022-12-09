import React, { useState, useEffect } from 'react'
import { customStyles, mobileStyles } from './small/modalStyles'
import Modal from 'react-modal';
import PhotoAlbum from "react-photo-album";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
    useGalleryQuery,
    useAddGalleryMutation,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation
} from "../../features/galleryApi"
import axios from 'axios'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import SingleImage from './small/SingleImage';
import PhotoModal from './small/PhotoModal';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 80
}));


function Gallery() {

    const { data, error, isLoading, isSuccess } = useGalleryQuery();
    const [addModal, setAddModal] = useState(true)
    const [currentPhoto, setCurrentPhoto] = useState({})
    const [photoDetails, setPhotoDetails] = useState([])
    const [photos, setPhotos] = useState([])

    const user = JSON.parse(localStorage.getItem('user'))
    const tok = user.token
    const bearer = 'Bearer ' + tok

    const SETTING_URL = '/api/settings'

    const [modalIsOpen, setIsOpen] = React.useState(false);


    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const [modalIsOpen1, setIsOpen1] = React.useState(false);


    function openModal1() {
        setIsOpen1(true);
    }

    function closeModal1() {
        setIsOpen1(false);
    }


    useEffect(() => {
        const callSetting = async () => {
            const response = await axios.get(SETTING_URL, {
                headers: {
                    Authorization: bearer,
                }
            })
            if (data) {
                const newData = data.map(e => ({ id: e.id, name: e.name, alt: e.alt, src: '/' + e.link, width: e.width, height: e.height, link: e.link }))
                const photoMap = data.map(e => ({ src: '/' + e.link, width: Number(e.width), height: Number(e.height) }))
                setPhotos(photoMap)
                setPhotoDetails(newData)
            }
        }

        callSetting()

    }, [data])

    const addImage = () => {
        setAddModal(true)
        openModal()
    }

    const updateImage = (photo) => {
        const cphoto = photoDetails.filter(e => e.src == photo.src)
        setCurrentPhoto(cphoto[0])
        setAddModal(false)
        openModal()
    }





    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    if (isLoading) {
        return (<h1>Loading</h1>)
    }
    return (
        <div className="main-content">
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-3 mb-3">
                        <button className="btn btn-lg btn-outline-success mb-3" type='submit' onClick={addImage}>Add Image</button>
                        <button className="btn btn-lg btn-outline-danger mb-3 ml-3" type='submit' onClick={openModal1}>Delete Image</button>
                        {photos.length > 0 ? <div>
                            <PhotoAlbum
                                photos={photos}
                                layout="rows"
                                targetRowHeight={200}
                                onClick={(event, photo, index) => updateImage(photo)}
                            />
                        </div> : null}
                    </div>
                </div>
            </div>
            <Modal isOpen={modalIsOpen}
                onRequestClose={closeModal}
                closeModal={closeModal}
                style={matches ? mobileStyles : customStyles}><SingleImage currentPhoto={currentPhoto} addModal={addModal} closeModal={closeModal} /></Modal>
            <PhotoModal modalIsOpen1={modalIsOpen1} closeModal1={closeModal1} deletePhoto={true} />

        </div>
    )
}

export default Gallery