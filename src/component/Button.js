function Button({ text, onClick, color }) {
    const baseStyle = `py-2 px-4 rounded shadow-sm focus:outline-none`;
    const colorStyles = {
      blue: "bg-blue-500 hover:bg-blue-600 text-white",
      red: "bg-red-500 hover:bg-red-600 text-white",
      green: "bg-green-500 hover:bg-green-600 text-white",
    };
  
    return (
      <button onClick={onClick} className={`${baseStyle} ${colorStyles[color]}`}>
        {text}
      </button>
    );
  }
  export default Button;