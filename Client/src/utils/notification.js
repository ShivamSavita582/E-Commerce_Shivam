import { toast, Bounce } from "react-toastify";

const defaultToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce,
};

export const notify = {
  success: (message, options = {}) => {
    toast.success(message, { ...defaultToastOptions, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { ...defaultToastOptions, ...options });
  },
  info: (message, options = {}) => {
    toast.info(message, { ...defaultToastOptions, ...options });
  },
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultToastOptions, ...options });
  },
};
