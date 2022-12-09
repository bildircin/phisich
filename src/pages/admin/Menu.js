import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from 'react-modal';
import {
    useMenusQuery,
    useAddMenuMutation,
    useUpdateMenuMutation,
    useDeleteMenuMutation
} from "../../features/menuApi"
import { customStyles, mobileStyles } from './small/modalStyles'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Waiting from '../../components/Waiting';


function Menu() {
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

    const initialSocial = [{ id: '', name: '', link: '', menu_place: '' }]

    const { data, error, isLoading, isSuccess } = useMenusQuery();
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

    const [updateMenu] = useUpdateMenuMutation();
    const [deleteMenu] = useDeleteMenuMutation();
    const [addMenu] = useAddMenuMutation();

    const [addModal, setAddModal] = useState(true);


    const [socials, setSocials] = useState([{ name: '', link: '', menu_place: '' }])
    const [currentSocial, setCurrentSocial] = useState(initialSocial)

    const handleDelete = (id) => {
        deleteMenu(id).unwrap()
            .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Link Removed'))
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
            addMenu(currentSocial).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Menu Added'))
                .catch((error) => console.log(error))
            setIsOpen(false)
        } else {
            updateMenu(currentSocial).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('Menu Updated'))
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
        { field: 'name', headerName: 'Account', width: 160 },
        { field: 'link', headerName: 'Address', width: 230 },
        {
            field: 'menu_place',
            headerName: 'Menu Type',
            width: 250,
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
        return (<Waiting />)
    }
    return (
        <React.Fragment>
            <div className="main-content">
                <div className="row mt-3 mb-2 ml-1">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Header Footer Menu</h4>
                                <button className='btn btn-success' onClick={addSocialModal}>Add New Link</button>
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

            </div>


            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={matches ? mobileStyles : customStyles}
            >


                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="menu_name">Name</label>
                            <input type="text" id="menu_name" className="form-control" value={currentSocial.name} name="name" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="menu_link">Link</label>
                            <input type="text" id="menu_link" className="form-control" value={currentSocial.link} name="link" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="menu_type">Menu Type</label>
                            <select id="menu_type" className="form-control" value={currentSocial.menu_place} name="menu_place" onChange={onChange}>
                                <option value="">Select</option>
                                <option value="header">Header</option>
                                <option value="footer">Footer</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-outline-primary mb-2">{addModal ? 'Add Link' : 'Update Link'}</button>

                    </form>
                </div>

            </Modal>


        </React.Fragment>

    )
}

export default Menu