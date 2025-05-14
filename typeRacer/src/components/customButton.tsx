type ButtonProps ={
    text:string;
    imageSrc:string;
    onClick?: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({text, imageSrc, onClick})=>{
    return(
        <button  onClick={onClick} className="bg-gradient-to-b from-[#F0E7D8] to-[#E5CEA5] rounded-sm flex items-center justify-center space-x-4 hover:brightness-90 h-28  sm:h-16 md:h-28 lg:h-28 w-1/5">
            <span className="text-secondary font-orelega text-2xl sm:text-xl md:text-2xl lg:text-2xl">{text}</span>
            <img src={imageSrc}  className="w-24 h-24 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-16 lg:h-16"/>
        </button>
    );
};

export default CustomButton;