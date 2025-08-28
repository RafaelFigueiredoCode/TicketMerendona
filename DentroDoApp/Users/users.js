import { sha256 } from "js-sha256";

export default [
  {
    matricula: "123",
    senha: sha256("123"), 
    name: "Rafael",
    role: "user"
  },
  {
    matricula: "admin",
    senha: sha256("admin123"),
    name: "Administrador",
    role: "admin"
  }
];