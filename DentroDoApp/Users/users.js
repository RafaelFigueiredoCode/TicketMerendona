import bcrypt from "bcryptjs";

bcrypt.setRandomFallback((len) => {
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
});

const salt = bcrypt.genSaltSync(10);

export default [
  {
    id: 1,
    matricula: "admin",
    senha: bcrypt.hashSync("admin123", 10),
    name: "Administrador",
    role: "admin",
  },
  {
    id: 2,
    matricula: "123",
    senha: bcrypt.hashSync("2134", 10),
    name: "Rafael",
    role: "aluno",
  },
];

