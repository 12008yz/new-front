import React, {  useState } from "react";
import { useRegisterMutation } from "../../../app/services/auth/auth"; // Import the RTK query hook
import MainButton from "../../MainButton";
import {useUserContext} from "../../../UserContext";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { toggleUserFlow } = useUserContext();
  const [register] = useRegisterMutation(); // Use the RTK query hook

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError(null); // Сброс состояния ошибки
 
   try {
     const response = await register({ 
       email, 
       password, 
       username: nickname,
     }).unwrap();
     // Предполагается, что ответ содержит токены
     toggleUserFlow();
   } catch (error: any) {
     console.log(error);
     setError(
       error.data?.message || "Неверный формат. Пожалуйста, попробуйте еще раз."
     );
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className="flex flex-col justify-center ">
      <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-10">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="divide-y divide-gray-200 mt-2">
                <div className="py-2 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  {[
                    {
                      name: "nickname",
                      type: "text",
                      required: true,
                      value: nickname,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value),
                      placeholder: "Nickname",
                      label: "Nickname",
                    },
                    {
                      name: "email",
                      type: "email",
                      autoComplete: "email",
                      required: true,
                      value: email,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                      placeholder: "Email",
                      label: "Email",
                    },
                    {
                      name: "password",
                      type: "password",
                      autoComplete: "current-password",
                      required: true,
                      value: password,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
                      placeholder: "Password",
                      label: "Password",
                    }
                  ].map((input) => (
                    <div className="relative" key={input.name}>
                      <input
                        id={input.name}
                        name={input.name}
                        type={input.type}
                        autoComplete={input.autoComplete}
                        required={input.required}
                        value={input.value}
                        onChange={input.onChange}
                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-500 bg-white"
                        placeholder={input.placeholder}
                      />
                      <label
                        htmlFor={input.name}
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-indigo-500"
                      >
                        {input.label}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col ">
                  <MainButton
                    text="Регистрация"
                    disabled={loading}
                    loading={loading}
                    onClick={() => { }}
                    submit
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;