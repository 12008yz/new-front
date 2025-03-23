/// <reference types="vite/client" />

interface ImportMetaEnv {
   VITE_API_KEY: string;
   // Добавьте другие переменные окружения, если необходимо
 }
 
 interface ImportMeta {
   readonly env: ImportMetaEnv;
 }