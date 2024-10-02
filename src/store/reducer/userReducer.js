import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

export const userData = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const token = Cookies.get('accessToken');
        const response = await fetch('https://dummyjson.com/users', {
            headers: {
                'Authorization': token
            }
        });
        const data = await response.json();
        return data.users;
    }
);

export const fetchUserOrders = createAsyncThunk(
    'users/fetchUserOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://dummyjson.com/carts/user/${userId}`);
            const data = await response.json();
            return { userId, orders: data.carts };
        } catch (error) {
            return rejectWithValue('Siparişler getirilemedi');
        }
    }
);
export const addUserOrder = createAsyncThunk(
    'users/addUserOrder',
    async ({ userId, products }, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://dummyjson.com/carts/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:userId,
                    products:[products]
                })
            });
            const data = await response.json();
            return { userId, products: data };
        } catch (error) {
            return rejectWithValue('Sipariş Eklenemedi');
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, lastname }, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://dummyjson.com/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lastname })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('Güncelleme Başarısız');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await fetch(`https://dummyjson.com/users/${id}`, {
                method: 'DELETE',
            });
            return id;
        } catch (error) {
            return rejectWithValue('Silme İşlemi Başarısız');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        userOrders: {},
        loading: false,
        ordersLoading: false,
        error: null,
        ordersError: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // user data
        builder
            .addCase(userData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userData.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(userData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

        // order
            .addCase(fetchUserOrders.pending, (state) => {
                state.ordersLoading = true;
                state.ordersError = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.userOrders[action.payload.userId] = action.payload.orders;
                state.ordersError = null;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.ordersError = action.payload;
            })

        // updateuser
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;