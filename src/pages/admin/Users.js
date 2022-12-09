import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import Waiting from '../../components/Waiting';
import { toast } from 'react-toastify'
import {
    useUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useAddUserMutation
} from "../../features/userApi"
import ReactPaginate from 'react-paginate'
import './paginate.css'
import { customStyles, mobileStyles } from './small/modalStyles'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';




function Users() {
    const { data, error, isLoading, isSuccess } = useUsersQuery();




    const initialUser = [{
        id: "",
        email: "",
        name: "",
        surname: "",
        userrole: 0,
        verified: 0,
    }]

    const [rows, setrows] = useState(initialUser)

    useEffect(() => {
        if (data) {
            var arr = []
            var newarr = arr.concat(data)
            console.log(newarr)
            setrows(newarr)
        }
    }, [data])

    const addInitialUser = {
        name: "",
        surname: "",
        email: "",
        password: "",
        password2: "",
        verified: 1,
        verificationtoken: "---",
        userrole: ""

    }



    const [currentAddUser, setCurrentAddUser] = useState(addInitialUser)
    const [currentUser, setCurrentUser] = useState(initialUser)
    const [addModal, setAddModal] = useState(false)
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [addUser] = useAddUserMutation();

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const onChange = (e) => {
        if (!addModal) {
            setCurrentUser((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setCurrentAddUser((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

    }

    const handleDeleteUser = (id) => {
        deleteUser(id);
        renderAlerts();
    };

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
        setCurrentAddUser(addInitialUser);
    }

    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement('#root');

    const handleModal = (user) => {
        setAddModal(false)
        setCurrentUser(user);
        openModal()
    }

    const handleAdd = () => {
        setAddModal(true)
        setCurrentUser(addInitialUser);
        openModal()
    }

    /*name, surname, email, password, verified, verificationtoken, userrole */

    const handleUpdate = (e) => {
        e.preventDefault()
        if (addModal) {
            if (currentAddUser.password == currentAddUser.password2) {
                addUser(currentAddUser).unwrap()
                    .then((payload) => payload.error ? toast.error(payload.error) : toast.success('user added'))
                    .catch((error) => console.log(error))
                closeModal()
            } else {
                toast.error("Passwords don't match")
            }
        } else {
            updateUser(currentUser).unwrap()
                .then((payload) => payload.error ? toast.error(payload.error) : toast.success('user updated'))
                .catch((error) => console.log(error))
        }

    }

    const renderAlerts = () => {
        if (isLoading) {
            return <Waiting />
        } else if (isSuccess) {
            toast.success('Changes applied successfuly')
        } else if (error) {
            toast.error('Something wrong')
        }
    }

    const catchClick = (e) => {
        if (e.field == 'delete-icon') {
            handleDeleteUser(e.id)
        } else if (e.field == 'update-icon') {
            handleModal(e.row)
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign:'center' },
        { field: 'name', headerName: 'First name', width: 130 },
        { field: 'surname', headerName: 'Last name', width: 130 },
        {
            field: 'email',
            headerName: 'Email',
            type: 'number',
            width: 250,
        },
        {
            field: 'verified',
            headerName: 'Verified',
            sortable: false,
            width: 160,
            align:'center', 
            headerAlign:'center' 
        },
        {
            field: 'userrole',
            headerName: 'userrole',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 100,
            align:'center', 
            headerAlign:'center' 
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
            <div style={{ height: 400, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onCellClick={catchClick}
                />
            </div>
        );
    }

    return (
        <>
            <div className="main-content">
                <div className="container-fluid">
                    {/* start page title */}
                    <div className="row">
                        <div className="col-md-12 col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Users</h4><button className="btn btn-success mb-2" onClick={handleAdd}>Add User</button>

                                </div>
                                <div className="card-body">
                                    <DataTable />
                                </div>
                                {/* end card-body*/}
                            </div>
                        </div>

                    </div>
                    {/* end page title */}
                </div> {/* container-fluid */}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={matches ? mobileStyles : customStyles}
                contentLabel="Example Modal"
            >
                <div className="col-md-12">
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label htmlFor="email_address">Email address</label>
                            <input type="email" required className="form-control" id="email_address" disabled={!addModal ? true : false} aria-describedby="emailHelp" value={addModal ? currentAddUser.email : currentUser.email} name="email" onChange={addModal ? onChange : undefined} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_name">Name</label>
                            <input type="text" required className="form-control" id="user_name" aria-describedby="emailHelp" value={addModal ? currentAddUser.name : currentUser.name} name="name" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_surname">Surname</label>
                            <input type="text" className="form-control" id="user_surname" aria-describedby="emailHelp" value={addModal ? currentAddUser.surname : currentUser.surname} name="surname" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="admin_role">Admin Role</label>
                            <input type="text" required id="admin_role" value={addModal ? currentAddUser.userrole : currentUser.userrole} className="form-control" aria-describedby="emailHelp" name="userrole" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_verified">Email Verified</label>
                            <input type="text" id="email_verified" value={addModal ? currentAddUser.verified : currentUser.verified} className="form-control" aria-describedby="emailHelp" name="verified" onChange={onChange} />
                        </div>
                        {
                            addModal &&
                            <>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Password</label>
                                    <input type="password" required value={currentAddUser.password} className="form-control" aria-describedby="emailHelp" name="password" onChange={onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Password</label>
                                    <input type="password" required value={currentAddUser.password2} className="form-control" aria-describedby="emailHelp" name="password2" onChange={onChange} />
                                </div>
                            </>

                        }
                        <button type="submit" className="btn btn-outline-primary mb-2">{addModal ? 'Create' : 'Update'}</button>

                    </form>
                </div>

            </Modal>
        </>
    )
}
export default Users

