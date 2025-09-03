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
    matricula: "744939473",
    senha: bcrypt.hashSync("2134", salt),
    name: "Rafael",
    role: "user"
  },
  {
    matricula: "admin",
    senha: bcrypt.hashSync("admin123", salt),
    name: "Administrador",
    role: "admin"
  }
];
