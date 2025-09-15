export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }


    interface IMeta {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }
    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }
    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }
    interface IFetchUser {
        user: IUser
    }


    interface IUserTable {
        _id: string,
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IBulkUser {
        countSuccess: number;
        countError: number
        detail: string
    }

    interface IBookTable {
        _id: string;
        thumbnail: string;
        slider: string[]
        mainText: string;
        author: string,
        price: number,
        sold: number,
        quantity: number,
        category: string,
        createdAt: Date,
        updatedAt: Date,
        __v: number
    }

    interface IHistoryDetail {
        bookName: string;
        quantity: number;
        _id: string;
    }

    interface IHistory {
        _id: string;
        name: string;
        type: "COD" | "BANKING" | string; // Nếu chỉ có COD thì để "COD"
        email: string;
        phone: string;
        userId: string;
        detail: IHistoryDetail[];
        totalPrice: number;
        paymentStatus: "PAID" | "UNPAID" | string; // hoặc cụ thể hơn nếu có enum
        paymentRef: string;
        createdAt: Date; // hoặc Date nếu bạn dùng Date object
        updatedAt: Date;
        __v: number;
    }

    interface IOrderDetailItem {
        _id: string;
        bookName: string;
        quantity: number;
    }

    interface IOrderTable {
        _id: string;
        name: string;               // Tên người đặt hàng
        address: string;
        phone: string;
        type: "COD" | "BANK" | string; // Kiểu thanh toán
        paymentStatus: "PAID" | "UNPAID" | string;
        paymentRef: string;
        detail: IOrderDetailItem[]; // Danh sách sách đã đặt
        totalPrice: number;
        createdAt: string;          // ISO format: "2025-08-02T07:19:54.473Z"
        updatedAt: string;
        __v: number;
    }

    interface DataDashboard {
        countOrder: number;
        countUser: number;
        countBook: number;
    };

}

