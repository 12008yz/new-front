import { useState, useRef } from "react";
import Login from './Login'
import SingUp from './SingUp'
import './UserFlow.css'
import {useUserContext} from "../../../UserContext";
import useOutsideClick from '../../../hooks/useOutsideClick'
import Modal from '../../Modal'

const UserFlow: React.FC =() => {
   const [isLogin, setIsLogin] = useState<boolean>(true)
   const { toggleUserFlow,openUserFlow } = useUserContext()
   const loginRef = useRef(null)
   

   return (
      <div ref={loginRef}>
         <Modal open={openUserFlow} setOpen={toggleUserFlow} width={'400px'}>
         <div className="flex items-center justify-center p-8">
            <div className={`flex flex-col justify-center transition-all ${isLogin ? "h-[340px]" : "h-[380px]"
              }`}>
               {isLogin ? <Login /> : <SingUp />}
               <div className="flex text-black justify-end cursor-pointer mt-1" onClick={() => {
                  setIsLogin(!isLogin)
               }}>
                  {isLogin ? (
                     <div className="text-blue-500 underline">Или создайте новый аккаунт</div>
                  ) : (
                     <div className="text-blue-500 underline">Или войдите</div>
                  )}
               </div>
              </div>
         </div>
         </Modal>
      </div>
   )
}

export default UserFlow