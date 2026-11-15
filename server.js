import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`KosTerpadu berjalan di http://localhost:${PORT}`);
  console.log("Tekan CTRL + C untuk menghentikan server.");
});
