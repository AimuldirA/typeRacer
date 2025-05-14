type Props = {
    message: string;
    type?: 'success' | 'error';
}

const AlertMessage: React.FC<Props> = ({message, type = 'success'})=>{
    const baseStyle = "text-sm font-medium text-center w-1/2 mx-auto";
    const styles = {
    success: `${baseStyle} text-green-800 `,
    error: `${baseStyle}  text-red-800`
  };

  return <div className={styles[type]}>{message}</div>;
}

export default AlertMessage;