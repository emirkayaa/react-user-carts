import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, updateUser, userData, fetchUserOrders, addUserOrder } from "../store/reducer/userReducer";
import Modal from "../component/Modal";
import Button from "../component/Button";

function UserTable() {
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error,
    userOrders,
    ordersLoading,
    ordersError 
  } = useSelector((state) => state.users);

  const [selectUser, setSelectedUser] = useState(null);
  const [lastName, setLastName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCartsModalOpen, setIsAddCartsModalOpen] = useState(false);

  const [cartInputs, setCartInputs] = useState({
    titleInput: "",
    priceInput: "",
    quantityInput: "",
    discountPercentage: "",
    totalInput: "",
    discountedTotalInput: "",
    thumbnailInput: "",
  });

  useEffect(() => {
    dispatch(userData());
  }, [dispatch]);

  const CartChange = (e) => {
    const { name, value } = e.target;

    let updatedCartInputs = { ...cartInputs, [name]: value };

    const price = parseFloat(updatedCartInputs.priceInput);
    const quantity = parseFloat(updatedCartInputs.quantityInput);
    const discountPercentage = parseFloat(updatedCartInputs.discountPercentage);

    const total = price * quantity;
    const discountedTotal = total - (total * discountPercentage) / 100;

    updatedCartInputs.totalInput = total.toFixed(2);
    updatedCartInputs.discountedTotalInput = discountedTotal.toFixed(2);

    setCartInputs(updatedCartInputs);
  };

  const userClick = (user) => {
    setSelectedUser(user);
    setLastName(user.lastName);
    setIsModalOpen(true);
  };

  const viewOrders = (user) => {
    setSelectedUser(user);
    dispatch(fetchUserOrders(user.id));
  };

  const update = () => {
    if (selectUser) {
      dispatch(updateUser({ id: selectUser.id, lastName }));
      closeModal();
    }
  };

  const deleted = () => {
    if (selectUser) {
      dispatch(deleteUser(selectUser.id));
      closeModal();
    }
  };

  const orderAdd = (user) => {
    setSelectedUser(user);
    setIsAddCartsModalOpen(true);
  };

  const addCarts = (user) => {
    const products = {
      title: cartInputs.titleInput,
      price: cartInputs.priceInput,
      quantity: cartInputs.quantityInput,
      discountPercentage: cartInputs.discountPercentage,
      total: cartInputs.totalInput,
      discountedTotal: cartInputs.discountedTotalInput,
      thumbnail: cartInputs.thumbnailInput,
    };
    if (
      !products.title ||
      !products.price ||
      !products.quantity ||
      !products.discountPercentage ||
      !products.thumbnail
    ) {
      alert("Lütfen gerekli tüm alanları doldurun!");
      return;
    }

    dispatch(addUserOrder({ userId: user.id, products }));
    closeAddCartsModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const closeAddCartsModal = () => {
    setIsAddCartsModalOpen(false);
    setSelectedUser(null);
  };
  const inputFields = [
    { label: "Başlık", name: "titleInput" },
    { label: "Fiyat", name: "priceInput" },
    { label: "Miktar", name: "quantityInput" },
    { label: "İndirim Yüzdesi", name: "discountPercentage" },
    { label: "İndirimli Toplam", name: "discountedTotalInput" },
    { label: "Toplam", name: "totalInput" },
    { label: "Sipariş Resmi", name: "thumbnailInput" },
  ];

  if (loading) return <p>Kullanıcılar Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kullanıcı Listesi</h1>
    
      {/* Kullanıcılar Tablosu */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-300">Kullancı</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Telefon</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Email</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <td className="px-4 py-2 border-b border-gray-300">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">{user.phone}</td>
                <td className="px-4 py-2 border-b border-gray-300">{user.email}</td>
                <td className="px-4 py-2 border-b border-gray-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewOrders(user)}
                      className="text-green-600 hover:text-green-800 focus:outline-none mr-2"
                    >
                      Siparişler
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        userClick(user);
                      }}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        orderAdd(user);
                      }}
                      className="text-green-600 hover:text-green-800 focus:outline-none mr-2"
                    >
                      Sipariş Ekle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Siparişler Tablosu */}
      {selectUser && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Siparişler {selectUser.firstName} {selectUser.lastName}
          </h2>
          {ordersLoading ? (
            <p>Siparişler Yükleniyor</p>
          ) : ordersError ? (
            <p>Yüklenirken Hata: {ordersError}</p>
          ) : userOrders[selectUser.id]?.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left border-b border-gray-300">Sipariş ID</th>
                    <th className="px-4 py-2 text-left border-b border-gray-300">Toplam Ürünler</th>
                    <th className="px-4 py-2 text-left border-b border-gray-300">Toplam Miktar</th>
                    <th className="px-4 py-2 text-left border-b border-gray-300">İndirimli Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders[selectUser.id].map((order) => (
                    <tr key={order.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b border-gray-300">{order.id}</td>
                      <td className="px-4 py-2 border-b border-gray-300">{order.totalProducts}</td>
                      <td className="px-4 py-2 border-b border-gray-300">${order.total}</td>
                      <td className="px-4 py-2 border-b border-gray-300">${order.discountedTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Bu kullanıcı için sipariş bulunamadı.</p>
          )}
        </div>
      )}

      {/* Düzen Modal */}
      {isModalOpen && selectUser && (
        <Modal title={`Kulllanıcı: ${selectUser.firstName}`} onClose={closeModal}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Soyadı</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Girin"
            />
          </div>
          <div className="flex space-x-4">
            <Button text="Güncelle" onClick={update} color="blue" />
            <Button text="Sil" onClick={deleted} color="red" />
          </div>
        </Modal>
      )}

      {/* Ekle Cart Modal */}
      {isAddCartsModalOpen && selectUser && (
        <Modal title={`Sepet: ${selectUser.firstName}`} onClose={closeAddCartsModal}>
          {inputFields.map(({ label, name }) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                name={name}
                value={cartInputs[name]}
                onChange={CartChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Gir ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <Button 
            text="Sipariş Ekle" 
            onClick={() => addCarts(selectUser)} 
            color="green" 
            disabled={
              !cartInputs.titleInput ||
              !cartInputs.priceInput ||
              !cartInputs.quantityInput ||
              !cartInputs.discountPercentage ||
              !cartInputs.thumbnailInput
            }
          />
        </Modal>
      )}
    </div>
  );
}

export default UserTable;
