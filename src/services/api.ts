import axios from '@/services/axios.customize'


const loginApi = async (username: string, password: string) => {
    const url = "/api/v1/auth/login"
    return await axios.post<IBackendRes<ILogin>>(url, {
        username,
        password
    }, {
        headers: {
            delay: 2000
        }
    })
}

const registerApi = async (fullName: string, email: string, password: string, phone: string) => {
    const url = "/api/v1/user/register"
    return await axios.post<IBackendRes<IRegister>>(url, {
        fullName,
        email,
        password,
        phone
    })
}

const fetchAccountApi = async () => {
    const url = "/api/v1/auth/account"
    // const access_token = localStorage.getItem("access_token")
    return await axios.get<IBackendRes<IFetchUser>>(url, {
        headers: {
            delay: 2000
        }
    })
}

const logoutApi = async () => {
    const url = "/api/v1/auth/logout"
    return await axios.post<IBackendRes<IFetchUser>>(url)
}


const getUserApi = async (query: string) => {
    const url = `/api/v1/user?${query}`
    return await axios.get<IBackendRes<IModelPaginate<IUserTable>>>(url)
}


const createUserApi = async (fullName: string, email: string, password: string, phone: string) => {
    const url = "/api/v1/user"
    return await axios.post<IBackendRes<IRegister>>(url, {
        fullName,
        email,
        password,
        phone
    })
}

const updateUserApi = async (_id: string, fullName: string, phone: string) => {
    const url = "/api/v1/user"
    return await axios.put<IBackendRes<IRegister>>(url, {
        _id,
        fullName,
        phone
    })
}

const updateUserApiByClient = async (_id: string, fullName: string, phone: string, avatar: string) => {
    const url = "/api/v1/user"
    return await axios.put<IBackendRes<IRegister>>(url, {
        _id,
        fullName,
        phone,
        avatar
    })
}


const deleteUserApi = async (_id: string) => {
    const url = `/api/v1/user/${_id}`
    return await axios.delete<IBackendRes<IRegister>>(url)
}

const createListUserApi = async (dataSource: any) => {
    const url = "/api/v1/user/bulk-create"
    return await axios.post<IBackendRes<IBulkUser>>(url, dataSource)
}

const getBookApi = async (query: string) => {
    const url = `/api/v1/book?${query}`
    return await axios.get<IBackendRes<IModelPaginate<IBookTable>>>(url)
}

const getCategoryBook = async () => {
    const url = "/api/v1/database/category"
    return await axios.get<IBackendRes<string[]>>(url)
}

const callUploadBookImg = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        },
    });
}

const createBookApi = async (mainText: string, author: string, price: number,
    quantity: number, category: string, thumbnail: string, slider: string[]
) => {
    const url = "/api/v1/book"
    return await axios.post<IBackendRes<IBookTable>>(url, {
        mainText, author, price, quantity, category, thumbnail, slider
    })

}

const updateBookApi = async (mainText: string, author: string, price: number,
    quantity: number, category: string, thumbnail: string, slider: string[], _id: string
) => {
    const url = `/api/v1/book/${_id}`
    return await axios.put<IBackendRes<IBookTable>>(url, {
        mainText, author, price, quantity, category, thumbnail, slider
    })

}


const deleteBookApi = async (_id: string) => {
    const url = `/api/v1/book/${_id}`
    return await axios.delete<IBackendRes<IRegister>>(url)
}

const getDetailBookApi = async (_id: string) => {
    const url = `/api/v1/book/${_id}`
    return await axios.get<IBackendRes<IBookTable>>(url)
}

const createOrder = async (name: string, address: string, phone: string, totalPrice: number, type: string, detail: any) => {
    const url = `/api/v1/order`
    return await axios.post<IBackendRes<IBookTable>>(url, {
        name, address, phone, totalPrice, type, detail
    })
}

const getHistoryOrder = async () => {
    const url = '/api/v1/history'
    return await axios.get<IBackendRes<IHistory[]>>(url)
}

const changePasswordApi = async (email: string, oldpass: string, newpass: string) => {
    const url = '/api/v1/user/change-password'
    return await axios.post<IBackendRes<IRegister>>(url, {
        email, oldpass, newpass
    })
}

const getOrderApi = async (query: string) => {
    const url = `/api/v1/order?${query}`
    return await axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(url)
}

const getDashboardApi = async () => {
    const url = '/api/v1/database/dashboard'
    return await axios.get<IBackendRes<DataDashboard>>(url)
}

export {
    loginApi, registerApi, fetchAccountApi, logoutApi, getUserApi,
    createUserApi, updateUserApi, deleteUserApi, createListUserApi,
    getBookApi, getCategoryBook, callUploadBookImg, createBookApi,
    updateBookApi, deleteBookApi, getDetailBookApi, createOrder,
    getHistoryOrder, updateUserApiByClient, changePasswordApi, getOrderApi,
    getDashboardApi
}