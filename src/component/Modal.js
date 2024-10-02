function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-4">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="max-h-[70vh] overflow-y-auto">
            {children}
          </div>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Kapat
          </button>
        </div>
      </div>
      
    );
  }

  export default Modal;