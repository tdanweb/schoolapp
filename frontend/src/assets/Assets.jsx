import CREST from "/CREST.jpg"
import { motion } from "framer-motion"
export {CREST}

export function Crest({ width, width2 }){
    return <div className={`rounded-lg shadow-lg w-fit bg-white`}>
        <img src={CREST} width={width || '40px'} className={`h-auto rounded-full`} alt="Crest"/>
    </div>
}

export function UserIcon({image, size, title}){
    return <motion.div
        className="w-fit"
        initial={{opacity: .5, scale: .5}} animate={{opacity: 1, scale: 1}} transition={{duration: .6}}
    >
        <img 
        className="rounded-full shadow-lg"
        src={image}
         width={size || "60px"} height="auto" alt="User Image"/>
         <small className="text-center px-3 font-roboto">{title}</small>
    </motion.div>
}