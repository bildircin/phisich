import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from 'react-modal';
import { useSocialsQuery, useAddSocialMutation, useUpdateSocialMutation, useDeleteSocialMutation } from "../../features/socialApi"
import { customStyles, mobileStyles } from './small/modalStyles'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


function Social() {
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

    const initialSocial = [{ id: '', name: '', link: '', color: '' }]

    const { data, error, isLoading, isSuccess } = useSocialsQuery();
    const [rows, setrows] = useState([])


    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (data) {
            var arr = []
            var newarr = arr.concat(data)
            console.log(newarr)
            setrows(newarr)
        }
    }, [data])

    const [updateSocials] = useUpdateSocialMutation();
    const [deleteSocials] = useDeleteSocialMutation();
    const [addSocials] = useAddSocialMutation();

    const [addModal, setAddModal] = useState(true);


    const [socials, setSocials] = useState([{ name: '', link: '', color: '' }])
    const [currentSocial, setCurrentSocial] = useState(initialSocial)

    const handleDelete = (id) => {
        deleteSocials(id).unwrap()
            .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Account Removed'))
            .catch((error) => console.log(error))
    }

    const upDateModal = (social) => {
        setCurrentSocial(social)
        setAddModal(false)
        openModal()
    }

    const addSocialModal = () => {
        setCurrentSocial(initialSocial[0])
        setAddModal(true)
        openModal()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (addModal) {
            addSocials(currentSocial).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Account Added'))
                .catch((error) => console.log(error))
            setIsOpen(false)
        } else {
            updateSocials(currentSocial).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Account Updated'))
                .catch((error) => console.log(error))
            setIsOpen(false)
        }
    }


    useEffect(() => {
        if (data) {
            setSocials(data)
        }
    }, [data])

    const onChange = (e) => {
        setCurrentSocial((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const catchClick = (e) => {
        if (e.field == 'delete-icon') {
            handleDelete(e.id)
        } else if (e.field == 'update-icon') {
            upDateModal(e.row)
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign:'center' },
        { field: 'name', headerName: 'Account', width: 130 },
        { field: 'link', headerName: 'Address', width: 360 },
        {
            field: 'color',
            headerName: 'Color',
            width: 170,
        },
        {
            field: 'update-icon',
            headerName: 'Update',
            description: 'Update Users',
            sortable: false,
            width: 80,
            align:'center', 
            headerAlign:'center',
            renderCell: () => <i className='fas fa-edit' style={{ color: "blue", cursor: "pointer" }} ></i>
        }, {
            field: 'delete-icon',
            headerName: 'Delete',
            description: 'Delete Users',
            sortable: false,
            width: 80,
            align:'center', 
            headerAlign:'center',
            renderCell: () => <i className='fas fa-trash' style={{ color: "red", cursor: "pointer" }} ></i>
        }
    ];


    function DataTable() {
        return (
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onCellClick={catchClick}
            />
        );
    }


    /* <div className="form-group">
                                <label>Social Network Color</label>
                                <input type="text" className="form-control" placeholder="Social Network Name" />
                            </div> */
    if (isLoading) {
        return (<h1>Loading</h1>)
    }
    return (
        <React.Fragment>
            <div className="main-content">
                <div className="row mt-3 mb-2 ml-1">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Social Accounts</h4>
                                <button className='btn btn-success' onClick={addSocialModal}>Add New Account</button>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div style={{ height: 400, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                                        <DataTable />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="row mt-2 mb-2">
                    <div className="col-md-12 text-center">
                        <h1>Previews</h1>

                    </div>
                </div>
                <div className="row text-center">

                    {socials.map((social) => {
                        return (
                            <div className="col-md-2 col-sm-4 col-4 mb-2" key={social.name}>
                                <i className={`fab fa-${social.name}`} style={{ color: social.color, fontSize: 2 + 'rem' }}></i>
                            </div>
                        )
                    })}

                </div>

            </div>


            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={matches ? mobileStyles : customStyles} >
                    
                <div className="col-md-12 text-center">
                    <h3>Preview</h3>
                    <i className={`fab fa-${currentSocial.name}`} style={{ color: currentSocial.color, fontSize: 2 + 'rem' }}></i>
                </div>

                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="social_name">Name</label>
                            <input type="text" required className="form-control" id="social_name" value={currentSocial.name} name="name" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="social_link">Link</label>
                            <input type="text" required id="social_link" className="form-control" value={currentSocial.link} name="link" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="social_color">Color</label>
                            <input type="text" id="social_color" required className="form-control" value={currentSocial.color} name="color" onChange={onChange} />
                        </div>
                        <button type="submit" className="btn btn-outline-primary mb-2">{addModal ? 'Add Social' : 'Update Social'}</button>

                    </form>
                </div>

            </Modal>


        </React.Fragment>

    )
}

export default Social