import React, { useState, useEffect } from 'react'
import { customStyles, mobileStyles } from './modalStyles'
import Modal from 'react-modal';
import PhotoAlbum from "react-photo-album";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  useGalleryQuery,
  useAddGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation
} from "../../../features/galleryApi"
import axios from 'axios'
import { toast } from 'react-toastify'



function PhotoModal({ modalIsOpen1, closeModal1, deletePhoto, choosePhoto }) {
  const { data, error, isLoading, isSuccess } = useGalleryQuery();
  const [set, setSet] = useState({})
  const [deleteGallery] = useDeleteGalleryMutation()
  const user = JSON.parse(localStorage.getItem('user'))
  const tok = user.token
  const bearer = 'Bearer ' + tok

  const SETTING_URL = '/api/settings'

  useEffect(() => {
    const callSetting = async () => {
      if (data) {
        console.log(data)
        const newData = data.map((e) => ({ id: e.id, name: e.name, alt: e.alt, src: '/' + e.link, width: e.width, height: e.height }))
        setPhotos(newData)

      }

    }

    callSetting()

  }, [data])

  const onClick = (photo) => {
    if (deletePhoto) {
      const cphoto = photos.filter(e => e.src == photo.src)
      const item = cphoto[0]
      deleteGallery(item.id).unwrap()
        .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Image deleted'))
        .catch((error) => console.log(error))
      closeModal1()
    } else {
      choosePhoto(photo);
      toast.success("Image selected")
      closeModal1()
    }
  }


  const [photos, setPhotos] = useState([])
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div> <Modal
      isOpen={modalIsOpen1}
      onRequestClose={closeModal1}
      style={matches ? mobileStyles : customStyles}
      contentLabel="Example Modal"
    >
      <PhotoAlbum
        photos={photos}
        layout="rows"
        targetRowHeight={200}
        onClick={(event, photo, index) => { onClick(photo); }}
      />

    </Modal></div>
  )
}

export default PhotoModal