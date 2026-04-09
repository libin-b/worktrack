import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccess = (title, text, timer = 3000) => {
  return MySwal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: timer,
    showConfirmButton: false
  });
};

export const showError = (title, text) => {
  return MySwal.fire({
    icon: 'error',
    title: title,
    text: text,
  });
};

export const showWarning = (title, text) => {
  return MySwal.fire({
    icon: 'warning',
    title: title,
    text: text,
  });
};
